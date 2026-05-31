/* eslint-disable */
'use client';

import { useState, useEffect, useRef } from 'react';
// WHY: We import standard Lucide React icons to upgrade raw HTML elements 
// (such as closing cross marks and emoji tags) into high-fidelity premium visual assets.
import { X, Globe, Sparkles, Lock, KeyRound, ShieldAlert, LogOut } from "lucide-react";
import styles from './admin.module.css';


interface Article {
  topic: string;
  status: string;
  word_count?: number;
  // Normalised fields present when loaded from /api/admin/workflows (insights store)
  wordCount?: number;
  content?: string | { en: string; ar: string };
  image_url?: string;
  image?: string;
  error?: string;
  slug?: string;   // set for insights-store articles; used as the delete/edit identifier
  lang?: string;   // 'en' | 'ar' – set for insights-store articles
  title?: string;  // already-extracted title from insights-store articles
  description?: string;
}

const getBadgeClass = (status: string, styles: any) => {
  switch (status) {
    case 'generating': return styles['badge-generating'];
    case 'pending': return styles['badge-pending_review'];
    case 'pending_review': return styles['badge-pending_review'];
    case 'published': return styles['badge-published'];
    case 'error': return styles['badge-error'];
    default: return '';
  }
};

export default function Dashboard() {
  const [topic, setTopic] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Bilingual Editor State
  const [editContent, setEditContent] = useState('');
  const [editContentAr, setEditContentAr] = useState('');
  const [editLang, setEditLang] = useState<'en' | 'ar'>('en');
  const [isFetchingFull, setIsFetchingFull] = useState(false);

  const [activeTab, setActiveTab] = useState<'drafts' | 'published'>('drafts');
  const [secret, setSecret] = useState<string>('');
  const [processingTopic, setProcessingTopic] = useState<string | null>(null);

  // Authentication State
  // WHY: We add these client-side authentication states to manage access controls natively
  // without relying exclusively on fragile URL query parameters, resolving empty screen errors.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null means initial mount validation
  const [authError, setAuthError] = useState<string>('');
  const [inputSecret, setInputSecret] = useState<string>('');
  const [isAuthValidating, setIsAuthValidating] = useState<boolean>(false);

  const modalRef = useRef<HTMLDialogElement>(null);
  const secretRef = useRef('');
  const activeTabRef = useRef<'drafts' | 'published'>('drafts');

  useEffect(() => { secretRef.current = secret; }, [secret]);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  const fetchArticles = async (currentSecret: string, tab: 'drafts' | 'published') => {
    try {
      const url = tab === 'published' ? `/api/admin/workflows?tab=published` : `/api/article`;
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { 'Authorization': `Bearer ${currentSecret}` }
      });
      
      // WHY: Handle 401 Unauthorized errors specifically to trigger the login overlay.
      // This ensures that the user is prompted for password entry rather than getting stuck in an empty state.
      if (res.status === 401) {
        setIsAuthenticated(false);
        setAuthError('Access denied: Invalid administrative secret key.');
        return false;
      }
      
      if (!res.ok) {
        throw new Error(`Server returned status code ${res.status}`);
      }
      
      const data = await res.json();
      if (data.error) {
        setIsAuthenticated(false);
        setAuthError(data.error);
        return false;
      }
      
      setArticles(data.articles || []);
      setIsAuthenticated(true);
      setAuthError('');
      return true;
    } catch (err: any) {
      console.error('[dashboard] Failed to fetch articles:', err);
      return false;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSecret = params.get('secret') || '';
      
      // WHY: Read credentials from localStorage if absent in query parameters.
      // This is a much more premium UX than forcing URL parameter preservation on every reload.
      const savedSecret = localStorage.getItem('ak_admin_secret') || '';
      const activeSecret = urlSecret || savedSecret;

      if (activeSecret) {
        setSecret(activeSecret);
        secretRef.current = activeSecret;
        localStorage.setItem('ak_admin_secret', activeSecret);

        // WHY: Strip credentials from URL address bar once registered.
        // This stops secret keys leaking when screen-sharing, copy-pasting links, or in browser history logs.
        if (urlSecret) {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }

        fetchArticles(activeSecret, 'drafts');
      } else {
        setIsAuthenticated(false);
      }

      const interval = setInterval(() => {
        if (document.visibilityState === 'visible' && secretRef.current) {
          fetchArticles(secretRef.current, activeTabRef.current);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const handleTabChange = (tab: 'drafts' | 'published') => {
    activeTabRef.current = tab;
    setActiveTab(tab);
    if (secret) {
      fetchArticles(secret, tab);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSecret.trim()) {
      setAuthError('Please enter a secret key.');
      return;
    }

    setIsAuthValidating(true);
    setAuthError('');

    // WHY: Verify entered secret by trying to query drafts list.
    // This is secure and doesn't require a dedicated validation route.
    const isValid = await fetchArticles(inputSecret, activeTab);

    if (isValid) {
      setSecret(inputSecret);
      secretRef.current = inputSecret;
      localStorage.setItem('ak_admin_secret', inputSecret);
      setAuthError('');
    }

    setIsAuthValidating(false);
  };

  const handleLock = () => {
    if (confirm('Are you sure you want to lock the administrative console?')) {
      setSecret('');
      secretRef.current = '';
      localStorage.removeItem('ak_admin_secret');
      setIsAuthenticated(false);
      setArticles([]);
      setAuthError('');
      setInputSecret('');
    }
  };


  const generateArticle = async () => {
    if (!topic.trim()) return alert('Enter a topic');
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secret}`
        },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Status code ${res.status}`);
      }
      setTopic('');
      handleTabChange('drafts');
    } catch (err: any) {
      alert('Failed to start generation: ' + (err.message || err));
    }
    setLoading(false);
  };

  const deleteArticle = async (art: Article) => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;
    const key = art.slug ? `${art.slug}-${art.lang}` : art.topic;
    setProcessingTopic(key);
    try {
      let res;
      if (art.slug && art.lang) {
        res = await fetch(`/api/admin/workflows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret}`
          },
          body: JSON.stringify({ slug: art.slug, lang: art.lang, action: 'delete' }),
        });
      } else {
        res = await fetch(`/api/article`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret}`
          },
          body: JSON.stringify({ topic: art.topic }),
        });
      }

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || `Server returned status ${res.status}`);
      if (data?.error) throw new Error(data.error);

      fetchArticles(secret, activeTab);
    } catch (err: any) {
      alert('Failed to delete article: ' + (err.message || err));
    } finally {
      setProcessingTopic(null);
    }
  };

  const publishArticle = async (art: Article) => {
    const key = art.slug ? `${art.slug}-${art.lang}` : art.topic;
    setProcessingTopic(key);
    try {
      let res;
      if (art.slug && art.lang) {
        res = await fetch(`/api/admin/workflows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret}`
          },
          body: JSON.stringify({ slug: art.slug, lang: art.lang, action: 'approve' }),
        });
      } else {
        res = await fetch(`/api/article`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret}`
          },
          body: JSON.stringify({ topic: art.topic, action: 'publish' }),
        });
      }
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || `Server returned status ${res.status}`);
      if (data?.error) throw new Error(data.error);

      fetchArticles(secret, activeTab);
    } catch (err: any) {
      alert('Failed to publish article: ' + (err.message || err));
    } finally {
      setProcessingTopic(null);
    }
  };

  const saveArticle = async () => {
    if (!selectedArticle) return;
    try {
      let res;
      // Why: Granular Bilingual Edit Mode.
      // If the article is already published, we call the workflows API to update live content directly.
      if (selectedArticle.slug) {
        res = await fetch(`/api/admin/workflows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret}`
          },
          body: JSON.stringify({
            slug: selectedArticle.slug,
            lang: 'en',
            action: 'update_live',
            contentEn: editContent,
            contentAr: editContentAr
          }),
        });
      } else {
        // Draft queue update
        res = await fetch(`/api/article`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${secret}`
          },
          body: JSON.stringify({ topic: selectedArticle.topic, action: 'edit', content: editContent }),
        });
      }

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || `Server returned status ${res.status}`);
      if (data?.error) throw new Error(data.error);

      fetchArticles(secret, activeTab);
      modalRef.current?.close();
    } catch (err: any) {
      alert('Failed to save article modifications: ' + (err.message || err));
    }
  };

  const viewArticle = async (art: Article) => {
    setSelectedArticle(art);
    setEditLang('en');
    
    if (art.slug) {
      // It's a published article; fetch full bilingual content
      setEditContent('Loading English content...');
      setEditContentAr('Loading Arabic content...');
      setIsFetchingFull(true);
      modalRef.current?.showModal();

      try {
        const res = await fetch(`/api/admin/workflows?slug=${art.slug}`, {
          headers: { 'Authorization': `Bearer ${secret}` }
        });
        const data = await res.json();
        if (data.article) {
          const content = data.article.content;
          setEditContent(typeof content === 'string' ? content : (content?.en || ''));
          setEditContentAr(typeof content === 'string' ? '' : (content?.ar || ''));
        } else {
          setEditContent('Failed to load content.');
          setEditContentAr('Failed to load content.');
        }
      } catch (err) {
        setEditContent('Error loading content.');
        setEditContentAr('Error loading content.');
      } finally {
        setIsFetchingFull(false);
      }
    } else {
      // Draft queue article
      setEditContent(typeof art.content === 'string' ? art.content : (art.content?.en || ''));
      setEditContentAr('');
      modalRef.current?.showModal();
    }
  };

  const displayedArticles =
    activeTab === 'drafts'
      ? articles.filter(art => art.status !== 'published')
      : articles;

  // WHY: Gating render structure to prevent flashes and ensure strict administrative security.
  if (isAuthenticated === null) {
    return (
      <div className={styles.container} style={{ display: 'flex', minHeight: '50vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.25rem' }}>
        {/* WHY: Sleek pulsing loader to hold layout shell while restoring localStorage credential sessions. */}
        <Lock className="animate-pulse" size={32} style={{ color: 'hsl(45, 74%, 55%)' }} />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Verifying security credentials...</span>
      </div>
    );
  }

  // WHY: Gating access. If not authenticated, we block dashboard render completely and display the lock console screen.
  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.authOverlay}>
          <div className={styles.authCard}>
            <div className={styles.authIconWrapper}>
              <Lock size={32} />
            </div>
            <h1 className={styles.authTitle}>Arabia Khaleej</h1>
            <p className={styles.authSubtitle}>
              Editorial Intelligence Console.<br />
              Please authenticate using your administrative secret key.
            </p>
            <form onSubmit={handleAuthSubmit} className={styles.authForm}>
              <div className={styles.authInputWrapper}>
                <input
                  type="password"
                  value={inputSecret}
                  onChange={(e) => setInputSecret(e.target.value)}
                  placeholder="ENTER SECRET ACCESS KEY"
                  className={styles.authInput}
                  disabled={isAuthValidating}
                  autoFocus
                />
              </div>
              
              {authError && (
                <div className={styles.authError}>
                  {authError}
                </div>
              )}
              
              <button
                type="submit"
                className={styles.btnAuthSubmit}
                disabled={isAuthValidating}
              >
                {isAuthValidating ? 'Verifying access...' : 'Authenticate'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h1>Arabia Khaleej AI Admin</h1>
          <div className={styles.status}>System Status: <span className={styles.online}>Online</span></div>
        </div>
        {/* WHY: Logout lock action in header to allow clearing active localStorage sessions easily. */}
        <button className={styles.lockBtn} onClick={handleLock}>
          <LogOut size={12} />
          Lock Console
        </button>
      </header>

      <div className={styles.topicCard}>
        <h2>Generate New Article</h2>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a trending topic (e.g. Dubai Real Estate...)"
            className={styles.input}
          />
          <button onClick={generateArticle} disabled={loading} className={styles.btnPrimary}>
            {loading ? 'Starting...' : 'Generate Article'}
          </button>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'drafts' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('drafts')}
        >
          Drafts Queue
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'published' ? styles.tabActive : ''}`}
          onClick={() => handleTabChange('published')}
        >
          Published Articles
        </button>
      </div>

      <div className={styles.grid}>
        {displayedArticles.length === 0 && (
          <p style={{color: '#94a3b8'}}>No {activeTab} articles yet.</p>
        )}

        {displayedArticles.map((art) => {
          const cardKey = art.slug ? `${art.slug}-${art.lang || 'en'}` : art.topic;
          const isProcessing = processingTopic === cardKey;

          return (
            <div key={cardKey} className={styles.card}>
              <span className={`${styles.badge} ${getBadgeClass(art.status, styles)}`}>
                {art.status?.replace('_', ' ') || 'unknown'}
              </span>
              {(art.image_url || art.image) ? (
                 <img src={art.image_url || art.image} alt="Hero" className={styles.cardImg} />
              ) : (
                 <div className={`${styles.cardImg} ${styles.placeholder} flex flex-col gap-2`}>
                   <span className="text-[28px] opacity-40">✍️</span>
                   <span className="text-[9px] font-black uppercase tracking-[0.25em] opacity-40">Editorial Insight Draft</span>
                 </div>
              )}
              <div className={styles.cardContent}>
                <h3>{art.title || art.topic}</h3>
                <p className={styles.meta}>Words: {art.word_count || art.wordCount || 0}</p>
                <div className={styles.actions}>
                  <button
                    className={styles.btnView}
                    onClick={() => viewArticle(art)}
                    disabled={art.status === 'generating'}
                    style={art.status === 'generating' ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                  >
                    Review / Edit
                  </button>
                  <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                    {art.status !== 'published' && (
                      <button
                        className={styles.btnPublish}
                        onClick={() => publishArticle(art)}
                        disabled={art.status === 'generating' || isProcessing}
                        style={(art.status === 'generating' || isProcessing) ? { opacity: 0.4, cursor: 'not-allowed', backgroundColor: '#6b7280', boxShadow: 'none' } : undefined}
                      >
                        {isProcessing ? 'Publishing...' : 'Publish'}
                      </button>
                    )}
                    <button
                      className={styles.btnDelete}
                      onClick={() => deleteArticle(art)}
                      disabled={isProcessing}
                      style={isProcessing ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                    >
                      {isProcessing ? 'Processing...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <dialog ref={modalRef} className={styles.modal}>
        {selectedArticle && (
          <div>
            <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h2 style={{margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white'}}>{selectedArticle.title || selectedArticle.topic}</h2>
              {/* WHY: Replaced raw, thick &times; string with a beautiful Lucide X icon inside a padded rounded button */}
              <button 
                onClick={() => modalRef.current?.close()} 
                style={{
                  color: 'rgba(255, 255, 255, 0.4)', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                className="hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {selectedArticle.slug && (
              <div className="flex gap-2 my-4">
                {/* WHY: Added Lucide Globe icon to language switch buttons and updated colors to use Arabia Khaleej gold brand palette */}
                <button 
                  onClick={() => setEditLang('en')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border-2 transition-all ${editLang === 'en' ? 'border-brand-gold text-brand-gold bg-brand-gold/10' : 'border-[#334155] text-slate-400 hover:border-slate-500'}`}
                >
                  <Globe size={14} />
                  English
                </button>
                <button 
                  onClick={() => setEditLang('ar')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border-2 transition-all ${editLang === 'ar' ? 'border-brand-gold text-brand-gold bg-brand-gold/10' : 'border-[#334155] text-slate-400 hover:border-slate-500'}`}
                >
                  <Globe size={14} />
                  العربية
                </button>
              </div>
            )}

            <textarea
              className={styles.textarea}
              value={editLang === 'en' ? editContent : editContentAr}
              onChange={(e) => editLang === 'en' ? setEditContent(e.target.value) : setEditContentAr(e.target.value)}
              placeholder={`Article markdown content (${editLang.toUpperCase()})...`}
              disabled={isFetchingFull}
              style={{
                direction: editLang === 'ar' ? 'rtl' : 'ltr',
                opacity: isFetchingFull ? 0.5 : 1
              }}
            />

            {selectedArticle.slug && (
              /* WHY: Replaced raw ✨ emoji with an animated pulsing Sparkles icon, matching the luxury premium look. */
              <div className="my-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3 items-start md:items-center">
                <Sparkles className="text-emerald-400 shrink-0 mt-0.5 md:mt-0 animate-pulse" size={18} />
                <p className="text-xs text-emerald-400/90 font-medium leading-relaxed m-0 text-left">
                  <strong>Live Editorial Edit Mode:</strong> You can now safely fix typos in either language. Saving will instantly update the live public feed without overriding the other language.
                </p>
              </div>
            )}

            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <button
                className={styles.btnSave}
                onClick={saveArticle}
                disabled={isFetchingFull}
                style={isFetchingFull ? {opacity: 0.4, cursor: 'not-allowed'} : undefined}
              >
                {isFetchingFull ? 'Loading...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
