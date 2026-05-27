
/* eslint-disable */
'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './admin.module.css';

interface Article {
  topic: string;
  status: string;
  word_count?: number;
  // Normalised fields present when loaded from /api/admin/workflows (insights store)
  wordCount?: number;
  content?: string;
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
    case 'pending_review': return styles['badge-pending_review'];
    case 'published': return styles['badge-published'];
    default: return '';
  }
};

export default function Dashboard() {
  const [topic, setTopic] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editContent, setEditContent] = useState('');
  const [activeTab, setActiveTab] = useState<'drafts' | 'published'>('drafts');
  const [secret, setSecret] = useState<string>('');
  
  const modalRef = useRef<HTMLDialogElement>(null);
  // Refs let the polling interval always read the latest secret/tab without recreating the timer.
  const secretRef = useRef('');
  const activeTabRef = useRef<'drafts' | 'published'>('drafts');

  // Keep refs in sync via useEffect so the polling interval always reads current values.
  // Note: refs are also updated eagerly inside handleTabChange / the initial useEffect to avoid
  // the single-render lag that useEffect introduces.
  useEffect(() => { secretRef.current = secret; }, [secret]);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  // Why two endpoints: /api/article only returns draft-queue articles (article:{topic} keys).
  // Published articles live in insights:article:{slug} / insights:list:{lang} and are
  // served by /api/admin/workflows?tab=published.
  const fetchArticles = async (currentSecret: string, tab: 'drafts' | 'published') => {
    try {
      const url =
        tab === 'published'
          ? `/api/admin/workflows?secret=${encodeURIComponent(currentSecret)}&tab=published`
          : `/api/article?secret=${encodeURIComponent(currentSecret)}`;

      const res = await fetch(url);
      if (!res.ok) {
        console.error(`[dashboard] Fetch failed with status ${res.status}`);
        return;
      }
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error('[dashboard] Failed to fetch articles:', err);
    }
  };

  useEffect(() => {
    // Why window check: Reading URL query parameters at mount ensures that
    // standard static compilation matches the client-side interactive requirements.
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlSecret = params.get('secret') || '';
      setSecret(urlSecret);
      secretRef.current = urlSecret;
      
      // Fetch immediately with urlSecret and the initial tab (drafts).
      fetchArticles(urlSecret, 'drafts');

      // Poll every 5 s using refs so we always see the current secret/tab.
      const interval = setInterval(() => {
        fetchArticles(secretRef.current, activeTabRef.current);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  // Switch tab and immediately reload the correct article set.
  // Sync activeTabRef eagerly here so the next polling tick (possibly < 5 s away) uses the new tab.
  const handleTabChange = (tab: 'drafts' | 'published') => {
    activeTabRef.current = tab;
    setActiveTab(tab);
    fetchArticles(secret, tab);
  };

  const generateArticle = async () => {
    if (!topic.trim()) return alert('Enter a topic');
    setLoading(true);
    try {
      // Why authorization headers: The generate endpoint is secured using bearer token headers,
      // which we forward to prevent unauthorized triggers.
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

  // Why two delete paths:
  // - Insights-store articles (loaded via /api/admin/workflows) are identified by slug+lang.
  //   They must be removed from insights:article:{slug} and both insights:list:{en/ar} lists.
  // - Draft-queue articles (loaded via /api/article) are identified by topic.
  //   /api/article DELETE already cascades to draft key + live keys + both list caches.
  const deleteArticle = async (art: Article) => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;
    try {
      if (art.slug && art.lang) {
        // Published insights-store article – remove via workflows API.
        const res = await fetch(`/api/admin/workflows?secret=${encodeURIComponent(secret)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: art.slug, lang: art.lang, action: 'delete' }),
        });
        if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      } else {
        // Draft-queue article – cascade-delete via article API.
        const res = await fetch(`/api/article?secret=${encodeURIComponent(secret)}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: art.topic }),
        });
        if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      }
      fetchArticles(secret, activeTab);
    } catch (err: any) {
      alert('Failed to delete article: ' + (err.message || err));
    }
  };

  const publishArticle = async (t: string) => {
    try {
      const res = await fetch(`/api/article?secret=${encodeURIComponent(secret)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t, action: 'publish' }),
      });
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      fetchArticles(secret, activeTab);
    } catch (err: any) {
      alert('Failed to publish article: ' + (err.message || err));
    }
  };

  const saveArticle = async () => {
    if (!selectedArticle) return;
    try {
      const res = await fetch(`/api/article?secret=${encodeURIComponent(secret)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: selectedArticle.topic, action: 'edit', content: editContent }),
      });
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      fetchArticles(secret, activeTab);
      modalRef.current?.close();
    } catch (err: any) {
      alert('Failed to save article modifications: ' + (err.message || err));
    }
  };

  const viewArticle = (art: Article) => {
    setSelectedArticle(art);
    setEditContent(art.content || '');
    modalRef.current?.showModal();
  };

  // For drafts tab: exclude published entries (they now have their own data source).
  // For published tab: all articles returned by /api/admin/workflows are already published.
  const displayedArticles =
    activeTab === 'drafts'
      ? articles.filter(art => art.status !== 'published')
      : articles;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Arabia Khaleej AI Admin</h1>
        <div className={styles.status}>System Status: <span className={styles.online}>Online</span></div>
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
        
        {displayedArticles.map((art) => (
          <div key={art.slug || art.topic} className={styles.card}>
            <span className={`${styles.badge} ${getBadgeClass(art.status, styles)}`}>
              {/* Added optional chaining and fallback 'unknown' to prevent UI rendering crashes if status is missing */}
              {art.status?.replace('_', ' ') || 'unknown'}
            </span>
            {(art.image_url || art.image) ? (
               <img src={art.image_url || art.image} alt="Hero" className={styles.cardImg} />
            ) : (
               <div className={`${styles.cardImg} ${styles.placeholder}`}>No Image</div>
            )}
            <div className={styles.cardContent}>
              {/* title is present for insights-store articles; fall back to topic for draft-queue articles */}
              <h3>{art.title || art.topic}</h3>
              <p className={styles.meta}>Words: {art.word_count || art.wordCount || 0}</p>
              <div className={styles.actions}>
                <button className={styles.btnView} onClick={() => viewArticle(art)}>Review / Edit</button>
                <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                  {art.status !== 'published' && (
                    <button className={styles.btnPublish} onClick={() => publishArticle(art.topic)}>Publish</button>
                  )}
                  <button className={styles.btnDelete} onClick={() => deleteArticle(art)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <dialog ref={modalRef} className={styles.modal}>
        {selectedArticle && (
          <div>
            <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <h2 style={{margin: 0}}>{selectedArticle.title || selectedArticle.topic}</h2>
              <button onClick={() => modalRef.current?.close()} style={{fontSize:'2rem', color:'white', background:'none', border:'none', cursor:'pointer'}}>&times;</button>
            </div>
            
            <textarea 
              className={styles.textarea}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Article markdown content..."
              // Why readOnly for insights-store articles: they have no draft-queue key, so PUT /api/article
              // would return 404 and silently discard edits. Editing live published articles requires
              // a separate workflow (approve with modified content via /api/admin/workflows).
              readOnly={!!(selectedArticle.slug && selectedArticle.lang)}
            />

            {selectedArticle.slug && selectedArticle.lang && (
              <p style={{color: '#f59e0b', fontSize: '0.85rem', margin: '0.5rem 0'}}>
                This is a live published article. Editing is read-only — delete and re-publish to update content.
              </p>
            )}
            
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <button
                className={styles.btnSave}
                onClick={saveArticle}
                // Disable save for insights-store articles that have no corresponding draft-queue key.
                disabled={!!(selectedArticle.slug && selectedArticle.lang)}
                style={selectedArticle.slug && selectedArticle.lang ? {opacity: 0.4, cursor: 'not-allowed'} : undefined}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
