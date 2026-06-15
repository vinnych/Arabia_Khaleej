"use client";

import { useEffect, useState, useMemo } from "react";
import { InsightItem } from '@/lib/database/insights';
import { useLanguage, getLocalizedHref } from '@/lib/i18n/i18n';
// Elegant icons chosen for maximum visual polish and semantic clarity.
// Languages, RefreshCw, BookOpen, BarChart2 were removed along with the Perspective (AR) translation mode.
import { Calendar, ChevronLeft, Share2, Clock, Tag, Quote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getDeterministicFallback } from '@/lib/services/fallbacks';
import MobileFAB from "@/components/layout/MobileFAB";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAuthorById } from '@/lib/core/authors';

// ─── Content analysis helpers ────────────────────────────────────────────────

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

type ContentProfile = 'brief' | 'standard' | 'deep-dive';

function getContentProfile(content: string): ContentProfile {
  const words = content.trim().split(/\s+/).length;
  if (words < 350) return 'brief';
  if (words < 1100) return 'standard';
  return 'deep-dive';
}

function detectFeatures(content: string) {
  return {
    // Check both properly-formatted and smushed table syntax
    hasTables: /^\|.+\|\s*\n\|[\s:-]+\|/m.test(content) || /\|[\s:-]+\|[\s:-|]*/.test(content),
    hasCode: /```/.test(content),
    hasBlockquotes: /^>/m.test(content),
    hasMultipleHeadings: (content.match(/^#{1,3} /gm) || []).length > 3,
  };
}

// ─── Markdown table repair ───────────────────────────────────────────────────
// AI agents sometimes send table rows concatenated on a single line instead of
// each row on its own line.  remark-gfm requires proper line breaks to parse
// tables, so we normalise the content before handing it to ReactMarkdown.

/** Split data rows from a flat string given the expected column count. */
function splitDataRows(content: string, colCount: number): string[] {
  const rows: string[] = [];
  let remaining = content.trim();
  const targetPipes = colCount + 1; // N cells → N+1 pipes  e.g. |a|b|c| = 4

  while (remaining.startsWith('|')) {
    let pipeFound = 0;
    let i = 0;

    for (; i < remaining.length; i++) {
      if (remaining[i] === '|') {
        pipeFound++;
        if (pipeFound === targetPipes) { i++; break; }
      }
    }

    if (pipeFound < targetPipes) {
      // Not enough pipes left — absorb the rest as the final row
      rows.push(remaining.trim());
      break;
    }

    const row = remaining.slice(0, i).trim();
    if (row) rows.push(row);
    remaining = remaining.slice(i).trim();
  }

  return rows;
}

/** Detect and repair a smushed GFM table line.
 *  Returns one or more lines; no-ops on non-table / already-correct lines. */
function repairSmushedTableLine(line: string): string[] {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) return [line];

  // Locate a GFM separator row pattern: cells that are ONLY dashes / colons / spaces
  // e.g. |---|:---|---:| or |---|---|---|---|
  const sepRegex = /(\|(?:[\t ]*[-:]+[\t ]*\|)+)/;
  const sepMatch = trimmed.match(sepRegex);
  if (!sepMatch) return [line]; // no separator → normal paragraph line

  const sepStr  = sepMatch[0];
  const sepIdx  = trimmed.indexOf(sepStr);

  // If the separator spans the whole line it is already a proper separator row
  if (sepStr.trim() === trimmed) return [line];

  // Content before the separator → becomes the header row
  const headerPart = trimmed.slice(0, sepIdx).trim();

  // Content after the separator → zero or more data rows
  const afterSep = trimmed.slice(sepIdx + sepStr.length).trim();

  if (!headerPart.startsWith('|')) return [line]; // Sanity check

  // Count columns from the separator cells
  const colCount = sepStr.split('|').filter(c => c.trim()).length;

  // Split possibly-smushed data rows
  const dataRows = afterSep ? splitDataRows(afterSep, colCount) : [];

  return [headerPart, sepStr.trim(), ...dataRows].filter(Boolean);
}

/**
 * Normalise markdown content so remark-gfm can parse it reliably:
 *   1. Expand literal `\n` two-character sequences (double-escaped newlines)
 *   2. Convert CRLF → LF
 *   3. Repair GFM tables whose rows are smushed onto a single line
 */
function preprocessMarkdown(content: string): string {
  // 1. Literal backslash-n (two chars) → actual newline
  if (!content.includes('\n') && content.includes('\\n')) {
    content = content.replace(/\\n/g, '\n');
  }

  // 2. Windows line endings
  content = content.replace(/\r\n/g, '\n');

  // 3. Repair smushed tables line by line
  const lines = content.split('\n');
  const out: string[] = [];
  for (const line of lines) {
    out.push(...repairSmushedTableLine(line));
  }

  return out.join('\n');
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InsightArticleClient({
  initialArticle,
  moreInsights = [],
}: {
  initialArticle: InsightItem;
  moreInsights?: InsightItem[];
}) {
  const { t, isRTL, language } = useLanguage();
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  // We removed translation and loading states since the side-by-side Perspective (AR)
  // translation block has been retired for a faster page load and clean UX.
  const [copied, setCopied] = useState(false);
  const article = initialArticle;

  // WHY: Query the rich author object for biography rendering to support high-end E-E-A-T presentation
  const fullAuthor = useMemo(() => {
    if (!article.author?.id) return null;
    // Normalize variant database IDs (e.g. zaid-alharbi vs zaid-al-harbi)
    const nid = article.author.id === "zaid-alharbi" ? "zaid-al-harbi" : article.author.id;
    return getAuthorById(nid);
  }, [article.author?.id]);

  // ── Derived content metadata ──────────────────────────────────────────────
  const readTime = useMemo(() => article.content ? estimateReadTime(article.content) : null, [article.content]);
  const contentProfile = useMemo(() => article.content ? getContentProfile(article.content) : 'standard', [article.content]);
  const features = useMemo(() => article.content ? detectFeatures(article.content) : { hasTables: false, hasCode: false, hasBlockquotes: false, hasMultipleHeadings: false }, [article.content]);
  const hasTags = article.tags && article.tags.length > 0;

  // ── Scroll progress ───────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Share ─────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.description.substring(0, 100) + "...",
      url: `${window.location.origin}${getLocalizedHref(`/insights/${article.slug}`, language)}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // ── Date formatter ────────────────────────────────────────────────────────
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(language === 'ar' ? 'ar-QA' : 'en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // ── Adaptive prose size based on content profile ──────────────────────────
  const proseBaseSize =
    contentProfile === 'brief' ? 'text-xl sm:text-2xl leading-[1.9]' :
    contentProfile === 'deep-dive' ? 'text-base sm:text-[1.0625rem] leading-[1.85]' :
    'text-[1.0625rem] sm:text-lg leading-[1.8]';

  return (
    <div className={`w-full max-w-4xl mx-auto px-4 py-12 pb-32 ${isRTL ? 'font-serif-ar' : ''}`}>

      {/* ── Scroll Progress Bar ───────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 w-full h-1 z-[110] bg-white/5 pointer-events-none">
        <div
          className="h-full bg-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      {/* WHY: Tighter vertical flow (mb-6 instead of mb-12) eliminates visual void. Group-hover translate-x on ChevronLeft creates an organic micro-interaction. */}
      <Link
        href={getLocalizedHref("/insights", language)}
        className="hidden md:inline-flex items-center gap-2 text-foreground/40 hover:text-accent transition-all duration-300 mb-6 group"
      >
        <ChevronLeft 
          size={16} 
          className={`transition-transform duration-300 ease-out group-hover:-translate-x-1.5 ${isRTL ? 'rotate-180 group-hover:translate-x-1.5' : ''}`} 
        />
        <span className="text-[10px] font-black uppercase tracking-[0.25em]">{t('back')}</span>
      </Link>

      <MobileFAB
        icon={ChevronLeft}
        onClick={() => router.back()}
        label={t('back')}
        className={isRTL ? "[&_svg]:rotate-180" : ""}
      />

      {/* 
        Perspective Mode (AR) Toggle was removed to achieve a distraction-free, 
        minimal, and highly readable single-column editorial reading layout.
      */}

      <article className="space-y-10 transition-all duration-500">

        {/* ── Article Header ────────────────────────────────────────────── */}
        <header className="space-y-7">

          {/* 
            Minimal Metadata Row:
            Designed to offer clear reading context without distracting the reader.
            We replaced the multiple colored badges with high-end, low-contrast typography
            separated by elegant mid-dots.
          */}
          <div className="flex flex-wrap items-center gap-3 text-foreground/45 text-[11px] font-bold uppercase tracking-widest">
            <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-brand-gold/10 text-brand-gold border border-brand-gold/15">
              {article.source}
            </span>
            <span className="opacity-40">•</span>
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="opacity-70" />
              <span>{formatDate(article.pubDate)}</span>
            </div>
            {readTime && (
              <>
                <span className="opacity-40">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="opacity-70" />
                  <span>{readTime} min read</span>
                </div>
              </>
            )}
            {article.humanEdited && (
              <>
                <span className="opacity-40">•</span>
                <span className="text-emerald-500/90 font-extrabold tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Reviewed
                </span>
              </>
            )}
            {article.qualityScore && (
              <>
                <span className="opacity-40">•</span>
                <span className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-brand-gold/10 text-brand-gold border border-brand-gold/20 shadow-[0_0_12px_rgba(212,175,55,0.15)] flex items-center gap-1.5 hover:scale-[1.04] transition-transform duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                  Quality: {article.qualityScore}/10
                </span>
              </>
            )}
          </div>

          {/* Title — size adapts to content profile */}
          <h1
            className={`font-extrabold text-foreground leading-[1.05] tracking-tight ${
              contentProfile === 'brief'
                ? 'text-4xl sm:text-6xl lg:text-7xl'
                : contentProfile === 'deep-dive'
                ? 'text-3xl sm:text-5xl lg:text-[3.25rem]'
                : 'text-4xl sm:text-5xl lg:text-6xl'
            }`}
          >
            {/* WHY: Dynamically capitalize headings to ensure proper nouns (e.g. "dubai" -> "Dubai") assert professional editorial authority. */}
            <span className="capitalize">{article.title}</span>
          </h1>

          {/* Author bar */}
          <div className="flex items-center justify-between py-5 border-y border-white/5">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-gold/30 shrink-0">
                <Image
                  src={fullAuthor?.image || "/authors/zaid.png"}
                  alt={article.author?.name || article.source}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">{t('editorialLeadership')}</p>
                <p className="text-sm font-bold text-foreground">{article.author?.name || article.source}</p>
                <p className="text-[10px] font-medium opacity-50 uppercase tracking-tight">
                  {article.author?.role || t('regionalIntelligence')}
                </p>
                {article.humanEdited && article.editedAt && (
                  <p className="text-[10px] font-medium opacity-30 uppercase tracking-tight mt-0.5">
                    Edited: {new Date(article.editedAt).toLocaleDateString(language === 'ar' ? 'ar-QA' : 'en-US')}
                  </p>
                )}
              </div>
            </div>
            <div className="relative">
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground/40 hover:text-accent transition-all active:scale-95"
              >
                <Share2 size={18} />
              </button>
              {copied && (
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-accent text-brand-obsidian text-[10px] font-bold uppercase tracking-widest rounded-lg animate-in fade-in slide-in-from-bottom-1 whitespace-nowrap">
                  {t('linkCopied')}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Hero Image ────────────────────────────────────────────────── */}
        {article.image && (
          /* WHY: Shifted hero image boundaries from bubbly rounded-3rem corners and heavy shadow layers to a clean, understated rounded-xl geometric card frame. */
          <div className={`relative w-full overflow-hidden border border-white/5 ${
            contentProfile === 'brief'
              ? 'aspect-[21/9] rounded-xl'
              : 'aspect-video rounded-xl'
          }`}>
            <Image
              src={imgError ? getDeterministicFallback(article.slug) : article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
              unoptimized={
                !!article.image &&
                !article.image.startsWith('/') &&
                !article.image.startsWith('https://images.unsplash.com') &&
                !article.image.startsWith('https://images.pexels.com')
              }
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        {/* ── Article Body ──────────────────────────────────────────────── */}
        {/*
          Clean, single-column reader experience.
          We removed the side-by-side translation grid to maximize readability,
          allowing the premium typography to shine.
        */}
        <div className="space-y-0 max-w-3xl mx-auto">

            {/* Lead / Description ── styled as pull intro */}
            <div className={`relative ${contentProfile === 'brief' ? 'mb-10' : 'mb-12'}`}>
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-gold/60 via-brand-gold/20 to-transparent rounded-full" />
              <p className={`pl-6 font-serif italic text-foreground/85 leading-relaxed ${
                contentProfile === 'brief'
                  ? 'text-2xl sm:text-3xl'
                  : 'text-xl sm:text-2xl'
              }`}>
                {article.description}
              </p>
            </div>

            {/* Decorative separator */}
            {article.content && (
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-px bg-brand-gold/10" />
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-brand-gold/40" />
                  <div className="w-1 h-1 rounded-full bg-brand-gold/20" />
                  <div className="w-1 h-1 rounded-full bg-brand-gold/10" />
                </div>
                <div className="flex-1 h-px bg-brand-gold/10" />
              </div>
            )}

            {/* Main Content via ReactMarkdown */}
            {article.content && (
              <div
                className={`article-body max-w-none ${proseBaseSize} text-foreground/80 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Headings
                    h1: ({ node, ...props }) => (
                      <h2
                        className="text-3xl sm:text-4xl font-extrabold mt-14 mb-6 text-foreground leading-tight border-l-4 border-brand-gold pl-5"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-2xl sm:text-3xl font-bold mt-12 mb-5 text-foreground/95 leading-snug"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-xl font-bold mt-10 mb-4 text-foreground/85 leading-snug"
                        {...props}
                      />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4
                        className="text-lg font-bold mt-8 mb-3 text-foreground/75 uppercase tracking-wide"
                        {...props}
                      />
                    ),
                    h5: ({ node, ...props }) => (
                      <h5
                        className="text-base font-bold mt-6 mb-2 text-foreground/65 uppercase tracking-widest text-[11px]"
                        {...props}
                      />
                    ),
                    h6: ({ node, ...props }) => (
                      <h6
                        className="text-sm font-bold mt-4 mb-2 text-brand-gold/70 uppercase tracking-widest"
                        {...props}
                      />
                    ),

                    // Paragraphs
                    p: ({ node, ...props }) => (
                      <p className="mb-7 last:mb-0" {...props} />
                    ),

                    // Block quote — styled as pull quote or GitHub Alert
                    blockquote: ({ node, children, ...props }) => {
                      // Extract the raw text from the blockquote to detect GitHub alerts
                      // children can be an array of React elements (paragraphs, etc.)
                      let isAlert = false;
                      let alertType = 'TIP';
                      let alertContent: React.ReactNode[] = [];
                      
                      // We need to inspect the children. Usually, a blockquote contains a paragraph <p>.
                      // A simplistic approach: just render it and use CSS, or inspect the text of the first child.
                      // Since remark-gfm doesn't parse alerts natively, the `[!TIP]` text is usually at the start of the first paragraph.
                      if (Array.isArray(children)) {
                        const firstChild: any = children[0];
                        if (firstChild?.props?.children) {
                          const firstText = Array.isArray(firstChild.props.children) 
                            ? firstChild.props.children[0] 
                            : firstChild.props.children;
                          
                          if (typeof firstText === 'string') {
                            const match = firstText.match(/^\[!(TIP|NOTE|IMPORTANT|WARNING|CAUTION)\]/i);
                            if (match) {
                              isAlert = true;
                              alertType = match[1].toUpperCase();
                              
                              // Strip the [!TIP] text from the first child
                              const newFirstText = firstText.replace(/^\[!(TIP|NOTE|IMPORTANT|WARNING|CAUTION)\]\s*/i, '');
                              
                              // Reconstruct the first paragraph without the alert tag
                              const newFirstChild = {
                                ...firstChild,
                                props: {
                                  ...firstChild.props,
                                  children: Array.isArray(firstChild.props.children)
                                    ? [newFirstText, ...firstChild.props.children.slice(1)]
                                    : newFirstText
                                }
                              };
                              
                              alertContent = [newFirstChild, ...children.slice(1)];
                            }
                          }
                        }
                      }

                      if (isAlert) {
                        return (
                          /* WHY: GitHub Alerts are rendered as premium callout cards using brand-aligned emerald styling. */
                          <div className="my-8 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex gap-4 items-start shadow-sm">
                            <span className="text-emerald-500 text-xl select-none mt-1">✨</span>
                            <div className="text-sm text-emerald-500/90 font-medium leading-relaxed m-0 text-left w-full [&>p]:mb-2 [&>p:last-child]:mb-0">
                              {alertContent}
                            </div>
                          </div>
                        );
                      }

                      /* WHY: Standard blockquotes use a classic, elegant, minimal editorial pull-quote style. */
                      return (
                        <blockquote
                          className="relative my-8 pl-6 pr-4 border-l-2 border-brand-gold/60 text-foreground/75 italic"
                          {...props}
                        >
                          <Quote
                            size={22}
                            className="absolute -top-2.5 left-1 text-brand-gold/50 rotate-180 fill-brand-gold/15"
                          />
                          {children}
                        </blockquote>
                      );
                    },

                    // Lists
                    ul: ({ node, ...props }) => (
                      <ul
                        className="mb-7 space-y-2.5 pl-0 list-none [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.6em] [&>li]:before:w-1.5 [&>li]:before:h-1.5 [&>li]:before:rounded-full [&>li]:before:bg-brand-gold/50"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="mb-7 space-y-2.5 pl-0 list-none [&>li]:relative [&>li]:pl-9 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0 [&>li]:before:w-6 [&>li]:before:h-6 [&>li]:before:rounded-full [&>li]:before:bg-brand-gold/10 [&>li]:before:border [&>li]:before:border-brand-gold/20 [&>li]:before:text-brand-gold [&>li]:before:text-[11px] [&>li]:before:font-bold [&>li]:before:flex [&>li]:before:items-center [&>li]:before:justify-center"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="leading-relaxed" {...props} />
                    ),

                    // Inline formatting
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-foreground" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-foreground/85" {...props} />
                    ),

                    // Links
                    a: ({ node, href, ...props }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-gold border-b border-brand-gold/30 hover:border-brand-gold transition-colors duration-200"
                        {...props}
                      />
                    ),

                    // Horizontal Rule — decorative divider
                    hr: ({ node, ...props }) => (
                      <div className="flex items-center gap-4 my-12" aria-hidden>
                        <div className="flex-1 h-px bg-white/8" />
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/50" />
                          <span className="w-1 h-1 rounded-full bg-brand-gold/25 mt-0.5" />
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/50" />
                        </div>
                        <div className="flex-1 h-px bg-white/8" />
                      </div>
                    ),

                    // Code — react-markdown passes `inline` prop for inline code
                    code: ({ node, inline, className, children, ...props }: any) => {
                      if (inline) {
                        return (
                          <code
                            className="px-2 py-0.5 rounded-md bg-brand-gold/10 text-brand-gold text-[0.85em] font-mono border border-brand-gold/15"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                      // Block code (inside <pre>)
                      return (
                        <code className="block font-mono text-sm text-foreground/85" {...props}>
                          {children}
                        </code>
                      );
                    },
                    pre: ({ node, ...props }) => (
                      <pre
                        className="bg-[#0a0c10] border border-white/10 rounded-2xl px-6 py-5 overflow-x-auto font-mono text-sm my-8 text-foreground/80 leading-relaxed shadow-inner"
                        {...props}
                      />
                    ),

                    // Tables — responsive wrapper
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-10 rounded-2xl border border-white/10 shadow-lg">
                        <table className="w-full text-sm border-collapse" {...props} />
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-brand-gold/8 border-b border-brand-gold/15" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                      <tbody className="divide-y divide-white/5" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                      <tr className="hover:bg-white/[0.03] transition-colors duration-150" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-brand-gold/80 whitespace-nowrap"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="px-5 py-3.5 text-foreground/70 leading-relaxed" {...props} />
                    ),

                    // Images inside content
                    img: ({ node, src, alt, ...props }) => (
                      <figure className="my-10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={alt}
                          className="w-full rounded-2xl object-cover shadow-xl border border-white/5"
                          loading="lazy"
                          {...props}
                        />
                        {alt && (
                          <figcaption className="text-center text-xs text-foreground/40 mt-3 italic">
                            {alt}
                          </figcaption>
                        )}
                      </figure>
                    ),
                  }}
                >
                  {/*
                    We pre-process the article content to repair tables whose rows were
                    congested onto a single line by LLMs/agents, normalize Windows CRLF endings,
                    and parse literal '\n' characters. This ensures remark-gfm can parse tables
                    properly rather than breaking.
                  */}
                  {preprocessMarkdown(article.content)}
                </ReactMarkdown>
              </div>
            )}

            {/* ── Sleek, Minimalist Author Signature Block ────────────────── */}
            {/* WHY: Implements the premium hybrid publishing standard: keeps the top clutter-free and provides full visual credentials and bio at the end of the article. */}
            {/* Added comprehensive error handling and safety fallbacks to prevent broken image displays or stray text markers if credentials are missing. */}
            {fullAuthor && (
              /* WHY: Converted bubbly rounded-full author profiles to minimal rounded-lg boxes. */
              <div className={`mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-5 items-start ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 flex items-center justify-center border border-white/5 shrink-0 mx-auto sm:mx-0">
                  {fullAuthor.image && !avatarError ? (
                    // WHY: next/image over <img> for WebP auto-conversion and LCP optimization.
                    // onError is not supported by next/image, so we gate on !avatarError state
                    // which is set by a separate Image error boundary pattern below.
                    // Width/height match the 40px rendered size of the avatar container.
                    <Image
                      src={fullAuthor.image}
                      alt={isRTL ? (fullAuthor.nameAr || fullAuthor.name || "Analyst") : (fullAuthor.name || "Analyst")}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover animate-in fade-in duration-300"
                      onError={() => {
                        // WHY: Gracefully handles broken image assets: swaps to letter badge fallback
                        setAvatarError(true);
                      }}
                    />
                  ) : (
                    <span className="text-brand-gold text-base font-bold select-none">
                      {((isRTL ? (fullAuthor.nameAr || fullAuthor.name) : (fullAuthor.name || "A"))[0] || "A").toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="space-y-1.5 flex-1 w-full">
                  <div className={`flex flex-wrap items-baseline gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h4 className="text-sm font-bold text-brand-gold">
                      {isRTL ? (fullAuthor.nameAr || fullAuthor.name) : (fullAuthor.name || "Editorial Analyst")}
                    </h4>
                    {(isRTL ? (fullAuthor.roleAr || fullAuthor.role) : fullAuthor.role) && (
                      <>
                        <span className="text-[10px] opacity-40">•</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                          {isRTL ? (fullAuthor.roleAr || fullAuthor.role) : fullAuthor.role}
                        </span>
                      </>
                    )}
                  </div>
                  {(isRTL ? (fullAuthor.bioAr || fullAuthor.bio) : fullAuthor.bio) && (
                    <p className="text-xs font-light leading-relaxed opacity-60 max-w-2xl">
                      {isRTL ? (fullAuthor.bioAr || fullAuthor.bio) : fullAuthor.bio}
                    </p>
                  )}
                  {fullAuthor.social?.[0] && (
                    <div className="pt-1">
                      <a
                        href={fullAuthor.social[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold uppercase tracking-wider text-brand-gold/50 hover:text-brand-gold transition-colors"
                      >
                        {isRTL ? "الملف المهني ↗" : "Professional Profile ↗"}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags — placed at the end of the article, following editorial best-practice.
                WHY: Moving tags below the article body (not the header) keeps the hero area
                clean and focused. Readers discover topic tags only after consuming the content,
                reducing cognitive load at article start. This mirrors how leading publishers
                (Medium, The Atlantic, NYT) structure their articles. */}
            {hasTags && (
              <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center gap-2">
                <Tag size={13} className="text-foreground/30" />
                {article.tags!.map((tag) => (
                  /* WHY: Scale transform + gold glow on hover rewards user engagement with
                     responsive tactile feedback without cluttering the reading experience. */
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-foreground/50 hover:border-brand-gold/40 hover:text-brand-gold hover:scale-[1.04] hover:shadow-[0_4px_12px_rgba(212,175,55,0.1)] transition-all duration-300 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
        </div>
      </article>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div className="mt-24 pt-12 border-t border-white/5 space-y-8">

        {/* Editorial Note */}
        <div className="glass p-6 rounded-2xl border border-brand-gold/10">
          <p className="text-xs text-foreground/60 leading-relaxed">
            <span className="font-bold text-brand-gold">Editorial Note:</span> This analysis was
            researched with AI assistance using real-time GCC economic data and reviewed by our
            editorial team. All insights are original to Arabia Khaleej and cite verifiable
            regional sources.
          </p>
        </div>

        {/* More Insights */}
        {moreInsights.length > 0 && (
          <div className="mb-24">
            <h2 className="text-2xl font-bold mb-8 opacity-60 uppercase tracking-widest text-center">
              {t('moreInsights')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {moreInsights.map((insight) => (
                <Link
                  key={insight.id}
                  href={`/${language === 'ar' ? 'ar' : 'en'}/insights/${insight.slug}`}
                  className="glass overflow-hidden rounded-xl border border-white/5 hover:border-brand-gold/30 transition-all group flex flex-col"
                >
                  {insight.image && (
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={insight.image}
                        alt={insight.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-obsidian/80 to-transparent opacity-60" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-gold mb-3 opacity-60">
                      {insight.source}
                    </p>
                    <h3 className="text-lg font-bold leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {insight.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.5em] mb-4">
            {t('transparencyNotice')}
          </p>
          <div className="w-12 h-1 bg-brand-gold/10 mx-auto" />
        </div>
      </div>
    </div>
  );
}
