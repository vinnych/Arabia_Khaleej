/* eslint-disable */
'use client';

import { useState, useEffect, useRef } from 'react';
// WHY: We import standard Lucide React icons to upgrade raw HTML elements 
// (such as closing cross marks and emoji tags) into high-fidelity premium visual assets.
// Added check, edit, eye, and column icons for the premium Markdown editor toolbar.
import { X, Globe, Sparkles, Lock, KeyRound, ShieldAlert, LogOut, Check, Edit2, Eye, Columns, RefreshCw } from "lucide-react";
import styles from './admin.module.css';

// WHY: We import ReactMarkdown and remarkGfm to support rich HTML previewing of generated draft files.
// This allows editors to instantly review, format, and check typography before publishing live,
// instead of reading raw markdown text blocks.
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// WHY: We implement a resilient localStorage wrapper. Accessing raw localStorage in private browsing,
// inside sandboxed web views, or with strict privacy extensions triggers a DOMException security error.
// Wrapping this in try-catch blocks ensures client-side hydration doesn't crash on boot.
const safeLocalStorage = {
  getItem(key: string): string {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key) || '';
      }
    } catch (e) {
      console.warn('[storage] Failed to read from localStorage:', e);
    }
    return '';
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('[storage] Failed to write to localStorage:', e);
    }
  },
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('[storage] Failed to remove from localStorage:', e);
    }
  }
};



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
  qualityScore?: number;
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
  // Defaults to false to immediately render the secure login console and avoid infinite loading loops.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [inputSecret, setInputSecret] = useState<string>('');
  const [isAuthValidating, setIsAuthValidating] = useState<boolean>(false);

  // Toast Queue State
  // WHY: We implement a custom, non-blocking React-based toast alert system to completely eliminate browser-blocking window.alert() popups.
  // This maintains luxury, unified aesthetics and avoids halting JavaScript thread execution.
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  // Confirmation Modal State
  // WHY: Replaces native window.confirm() dialogs with high-fidelity gold-and-obsidian portals.
  // Improves user validation security while ensuring consistent visuals during administrative operations.
  const [confirmAction, setConfirmAction] = useState<{ message: string; onConfirm: () => void } | null>(null);

  // Markdown Editor Tabs State
  // WHY: Allows the editor to switch between writing raw Markdown syntax (Write), inspecting a formatted HTML preview (Preview),
  // or engaging in a side-by-side editing grid (Split Screen) on large displays, greatly enhancing editing productivity.
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');

  const lastActiveRef = useRef(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastRefreshTimeRef = useRef(0);

  useEffect(() => {
    const updateActivity = () => {
      lastActiveRef.current = Date.now();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', updateActivity);
      window.addEventListener('keydown', updateActivity);
      window.addEventListener('click', updateActivity);
      window.addEventListener('scroll', updateActivity);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', updateActivity);
        window.removeEventListener('keydown', updateActivity);
        window.removeEventListener('click', updateActivity);
        window.removeEventListener('scroll', updateActivity);
      }
    };
  }, []);

  const handleManualRefresh = async () => {
    const now = Date.now();
    if (now - lastRefreshTimeRef.current < 2000) {
      addToast('Please wait a moment before refreshing again.', 'info');
      return;
    }
    if (!secret) return;
    setIsRefreshing(true);
    lastRefreshTimeRef.current = now;
    lastActiveRef.current = now; // reset idle
    const success = await fetchArticles(secret, activeTab);
    if (success) {
      addToast('Data refreshed successfully.', 'success');
    }
    setIsRefreshing(false);
  };

  const modalRef = useRef<HTMLDialogElement>(null);
  const secretRef = useRef('');
  const activeTabRef = useRef<'drafts' | 'published'>('drafts');

  useEffect(() => { secretRef.current = secret; }, [secret]);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  // WHY: Helper function to push elegant toast alerts to the admin panel's notification container.
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

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
      // WHY: If the API request fails due to network issues, CORS, or backend crashes, 
      // we must transition the app out of the initial `null` state to prevent an infinite loader screen.
      setIsAuthenticated(false);
      setAuthError(err.message || 'Failed to connect to the administrative server. Please try again.');
      return false;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSecret = params.get('secret') || '';
      
      // WHY: Read credentials from safeLocalStorage if absent in query parameters.
      // This is a much more premium UX than forcing URL parameter preservation on every reload.
      const savedSecret = safeLocalStorage.getItem('ak_admin_secret') || '';
      const activeSecret = urlSecret || savedSecret;

      if (activeSecret) {
        setSecret(activeSecret);
        secretRef.current = activeSecret;
        safeLocalStorage.setItem('ak_admin_secret', activeSecret);

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
        const isIdle = Date.now() - lastActiveRef.current > 5 * 60 * 1000;
        if (document.visibilityState === 'visible' && secretRef.current && !isIdle) {
          fetchArticles(secretRef.current, activeTabRef.current);
        }
      }, 120000); // 2 minutes
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

  const handleAuthSubmit = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
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
      safeLocalStorage.setItem('ak_admin_secret', inputSecret);
      setAuthError('');
      addToast('Console authenticated successfully.', 'success');
    }

    setIsAuthValidating(false);
  };

  const handleLock = () => {
    // WHY: Replaced standard browser confirm popup with our beautiful React custom portal overlay.
    setConfirmAction({
      message: 'Are you sure you want to lock the administrative console and end your session?',
      onConfirm: () => {
        setSecret('');
        secretRef.current = '';
        safeLocalStorage.removeItem('ak_admin_secret');
        setIsAuthenticated(false);
        setArticles([]);
        setAuthError('');
        setInputSecret('');
        addToast('Console locked.', 'info');
      }
    });
  };


  const generateArticle = async () => {
    if (!topic.trim()) {
      addToast('Please enter a trending topic to generate.', 'error');
      return;
    }
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
      addToast('Draft generation queued successfully.', 'success');
      setTopic('');
      handleTabChange('drafts');
    } catch (err: any) {
      addToast('Failed to start generation: ' + (err.message || err), 'error');
    }
    setLoading(false);
  };

  const deleteArticle = async (art: Article) => {
    // WHY: Replaced standard blocking browser confirm() with an elegant React portal modal confirmation.
    setConfirmAction({
      message: `Are you sure you want to permanently delete the article "${art.title || art.topic}"?`,
      onConfirm: async () => {
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

          addToast('Article deleted successfully.', 'success');
          fetchArticles(secret, activeTab);
        } catch (err: any) {
          addToast('Failed to delete article: ' + (err.message || err), 'error');
        } finally {
          setProcessingTopic(null);
        }
      }
    });
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

      addToast('Article published live to public feed.', 'success');
      fetchArticles(secret, activeTab);
    } catch (err: any) {
      addToast('Failed to publish article: ' + (err.message || err), 'error');
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

      addToast('Article changes saved successfully.', 'success');
      fetchArticles(secret, activeTab);
      modalRef.current?.close();
    } catch (err: any) {
      addToast('Failed to save article modifications: ' + (err.message || err), 'error');
    }
  };

  const viewArticle = async (art: Article) => {
    setSelectedArticle(art);
    setEditLang('en');
    // WHY: Reset markdown editor view tab to 'edit' (Write mode) on loading a new article.
    setViewMode('edit');
    
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

  // WHY: Gating render structure loader has been safely bypassed to prevent any loading hangs.
  // Gating access is handled immediately via the conditional state transition below.

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
            <div className={styles.authForm}>
              <div className={styles.authInputWrapper}>
                <input
                  type="password"
                  value={inputSecret}
                  onChange={(e) => setInputSecret(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAuthSubmit(e);
                    }
                  }}
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
                type="button"
                onClick={() => handleAuthSubmit()}
                className={styles.btnAuthSubmit}
                disabled={isAuthValidating}
              >
                {isAuthValidating ? 'Verifying access...' : 'Authenticate'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* WHY: Custom non-blocking Toast Stack rendered fixed in viewport layout */}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${styles.toast} ${styles[`toast-${toast.type}`]}`}>
            {toast.type === 'success' && <Check size={16} className={styles.toastIcon} />}
            {toast.type === 'error' && <ShieldAlert size={16} className={styles.toastIcon} />}
            {toast.type === 'info' && <KeyRound size={16} className={styles.toastIcon} />}
            <span className={styles.toastMessage}>{toast.message}</span>
            <button className={styles.toastClose} onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* WHY: Elegant custom React Portal-like confirmation overlay for deleting/locking */}
      {confirmAction && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmCard}>
            <div className={styles.confirmIconWrapper}>
              <ShieldAlert size={28} />
            </div>
            <h3 className={styles.confirmTitle}>Administrative Action</h3>
            <p className={styles.confirmMessage}>{confirmAction.message}</p>
            <div className={styles.confirmActions}>
              <button 
                className={styles.btnConfirmCancel} 
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </button>
              <button 
                className={styles.btnConfirmSubmit} 
                onClick={() => {
                  confirmAction.onConfirm();
                  setConfirmAction(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={styles.header}>
        {/* WHY: Removed inline style and used CSS class helper to style header layout */}
        <div className={styles.headerText}>
          <h1>Arabia Khaleej AI Admin</h1>
          <div className={styles.status}>System Status: <span className={styles.online}>Online</span></div>
        </div>
        <div className="flex gap-2 items-center">
          <button 
            className={styles.lockBtn} 
            onClick={handleManualRefresh} 
            disabled={isRefreshing}
            style={isRefreshing ? { opacity: 0.7 } : undefined}
          >
            <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          {/* WHY: Logout lock action in header to allow clearing active localStorage sessions easily. */}
          <button className={styles.lockBtn} onClick={handleLock}>
            <LogOut size={12} />
            Lock Console
          </button>
        </div>
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
          // WHY: Replaced inline styles with clean CSS class
          <p className={styles.noArticles}>No {activeTab} articles yet.</p>
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
                 // WHY: Removed redundant flex Tailwind utilities, styles already fully defined in .placeholder class
                 <div className={`${styles.cardImg} ${styles.placeholder}`}>
                   <span className="text-[28px] opacity-40">✍️</span>
                   <span className="text-[9px] font-black uppercase tracking-[0.25em] opacity-40">Editorial Insight Draft</span>
                 </div>
              )}
              <div className={styles.cardContent}>
                <h3>{art.title || art.topic}</h3>
                <p className={styles.meta}>
                  Words: {art.word_count || art.wordCount || 0}
                  {art.qualityScore !== undefined && ` • Score: ${art.qualityScore}/10`}
                </p>
                <div className={styles.actions}>
                  <button
                    className={styles.btnView}
                    onClick={() => viewArticle(art)}
                    disabled={art.status === 'generating'}
                    style={art.status === 'generating' ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                  >
                    Review / Edit
                  </button>
                  {/* WHY: Replaced inline styles with a class name helper */}
                  <div className={styles.actionsRow}>
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
            {/* WHY: Replaced inline style block with high-fidelity CSS class structure */}
            <div className={styles.modalHeader}>
              <h2 className={styles.modalHeaderTitle}>{selectedArticle.title || selectedArticle.topic}</h2>
              {/* WHY: Replaced raw, thick &times; string with a beautiful Lucide X icon inside a padded rounded button */}
              <button 
                onClick={() => modalRef.current?.close()} 
                className={styles.modalCloseBtn}
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

            {/* WHY: High-Fidelity Custom Markdown and Layout View Mode Toolbar */}
            <div className={styles.editorControls}>
              <div className={styles.viewModeTabs}>
                <button
                  onClick={() => setViewMode('edit')}
                  className={`${styles.viewModeBtn} ${viewMode === 'edit' ? styles.viewModeBtnActive : ''}`}
                >
                  <Edit2 size={13} />
                  Write
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`${styles.viewModeBtn} ${viewMode === 'preview' ? styles.viewModeBtnActive : ''}`}
                >
                  <Eye size={13} />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`${styles.viewModeBtn} ${viewMode === 'split' ? styles.viewModeBtnActive : ''} hidden lg:flex`}
                >
                  <Columns size={13} />
                  Split Screen
                </button>
              </div>
            </div>

            {/* WHY: Conditional rendering for the three Editorial view modes */}
            {viewMode === 'edit' && (
              <textarea
                className={`${styles.textarea} ${editLang === 'ar' ? styles.rtlText : styles.ltrText}`}
                value={editLang === 'en' ? editContent : editContentAr}
                onChange={(e) => editLang === 'en' ? setEditContent(e.target.value) : setEditContentAr(e.target.value)}
                placeholder={`Article markdown content (${editLang.toUpperCase()})...`}
                disabled={isFetchingFull}
                style={{ opacity: isFetchingFull ? 0.5 : 1 }}
              />
            )}

            {viewMode === 'preview' && (
              <div className={`${styles.previewContainer} ${editLang === 'ar' ? styles.rtlText : styles.ltrText} article-body`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {editLang === 'en' ? editContent : editContentAr}
                </ReactMarkdown>
              </div>
            )}

            {viewMode === 'split' && (
              <div className={styles.splitGrid}>
                <div className={styles.splitCol}>
                  <h4 className={styles.splitColTitle}>Source Editor</h4>
                  <textarea
                    className={`${styles.splitTextarea} ${editLang === 'ar' ? styles.rtlText : styles.ltrText}`}
                    value={editLang === 'en' ? editContent : editContentAr}
                    onChange={(e) => editLang === 'en' ? setEditContent(e.target.value) : setEditContentAr(e.target.value)}
                    placeholder={`Article markdown content (${editLang.toUpperCase()})...`}
                    disabled={isFetchingFull}
                    style={{ opacity: isFetchingFull ? 0.5 : 1 }}
                  />
                </div>
                <div className={styles.splitCol}>
                  <h4 className={styles.splitColTitle}>Live Render Preview</h4>
                  <div className={`${styles.splitPreview} ${editLang === 'ar' ? styles.rtlText : styles.ltrText} article-body`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {editLang === 'en' ? editContent : editContentAr}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {selectedArticle.slug && (
              /* WHY: Replaced raw ✨ emoji with an animated pulsing Sparkles icon, matching the luxury premium look. */
              <div className="my-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3 items-start md:items-center">
                <Sparkles className="text-emerald-400 shrink-0 mt-0.5 md:mt-0 animate-pulse" size={18} />
                <p className="text-xs text-emerald-400/90 font-medium leading-relaxed m-0 text-left">
                  <strong>Live Editorial Edit Mode:</strong> You can now safely fix typos in either language. Saving will instantly update the live public feed without overriding the other language.
                </p>
              </div>
            )}

            {/* WHY: Replaced dynamic inline style with styled .modalFooter class */}
            <div className={styles.modalFooter}>
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
