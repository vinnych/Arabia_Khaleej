
/* eslint-disable */
'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './admin.module.css';

interface Article {
  topic: string;
  status: string;
  word_count?: number;
  content?: string;
  image_url?: string;
  error?: string;
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

  // Why parameter passing: The state setter setSecret is asynchronous, so we allow passing
  // a local 'currentSecret' to prevent first-load queries from being made with an empty string.
  const fetchArticles = async (currentSecret: string = secret) => {
    try {
      const res = await fetch(`/api/article?secret=${encodeURIComponent(currentSecret)}`);
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
      
      // Fetch immediately with urlSecret
      fetchArticles(urlSecret);

      const interval = setInterval(() => fetchArticles(urlSecret), 5000);
      return () => clearInterval(interval);
    }
  }, []);

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
      fetchArticles(secret);
      setActiveTab('drafts');
    } catch (err: any) {
      alert('Failed to start generation: ' + (err.message || err));
    }
    setLoading(false);
  };

  const deleteArticle = async (t: string) => {
    if(!confirm("Are you sure you want to permanently delete this article?")) return;
    try {
      const res = await fetch(`/api/article?secret=${encodeURIComponent(secret)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t }),
      });
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      fetchArticles(secret);
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
      fetchArticles(secret);
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
      fetchArticles(secret);
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

  // Filter articles based on active tab
  const displayedArticles = articles.filter(art => 
    activeTab === 'drafts' ? art.status !== 'published' : art.status === 'published'
  );

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
          onClick={() => setActiveTab('drafts')}
        >
          Drafts Queue
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'published' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('published')}
        >
          Published Articles
        </button>
      </div>

      <div className={styles.grid}>
        {displayedArticles.length === 0 && (
          <p style={{color: '#94a3b8'}}>No {activeTab} articles yet.</p>
        )}
        
        {displayedArticles.map((art) => (
          <div key={art.topic} className={styles.card}>
            <span className={`${styles.badge} ${getBadgeClass(art.status, styles)}`}>
              {/* Added optional chaining and fallback 'unknown' to prevent UI rendering crashes if status is missing */}
              {art.status?.replace('_', ' ') || 'unknown'}
            </span>
            {art.image_url ? (
               <img src={art.image_url} alt="Hero" className={styles.cardImg} />
            ) : (
               <div className={`${styles.cardImg} ${styles.placeholder}`}>No Image</div>
            )}
            <div className={styles.cardContent}>
              <h3>{art.topic}</h3>
              <p className={styles.meta}>Words: {art.word_count || 0}</p>
              <div className={styles.actions}>
                <button className={styles.btnView} onClick={() => viewArticle(art)}>Review / Edit</button>
                <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                  {art.status !== 'published' && (
                    <button className={styles.btnPublish} onClick={() => publishArticle(art.topic)}>Publish</button>
                  )}
                  <button className={styles.btnDelete} onClick={() => deleteArticle(art.topic)}>Delete</button>
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
              <h2 style={{margin: 0}}>{selectedArticle.topic}</h2>
              <button onClick={() => modalRef.current?.close()} style={{fontSize:'2rem', color:'white', background:'none', border:'none', cursor:'pointer'}}>&times;</button>
            </div>
            
            <textarea 
              className={styles.textarea}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Article markdown content..."
            />
            
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <button className={styles.btnSave} onClick={saveArticle}>Save Changes</button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}