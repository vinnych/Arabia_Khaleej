/* eslint-disable i18next/no-literal-string */
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
  
  const modalRef = useRef<HTMLDialogElement>(null);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/article');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArticles();
    const interval = setInterval(fetchArticles, 5000);
    return () => clearInterval(interval);
  }, []);

  const generateArticle = async () => {
    if (!topic.trim()) return alert('Enter a topic');
    setLoading(true);
    try {
      await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      setTopic('');
      fetchArticles();
      setActiveTab('drafts');
    } catch (err) {
      alert('Failed to start generation');
    }
    setLoading(false);
  };

  const deleteArticle = async (t: string) => {
    if(!confirm("Are you sure you want to permanently delete this article?")) return;
    await fetch('/api/article', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: t }),
    });
    fetchArticles();
  };

  const publishArticle = async (t: string) => {
    await fetch('/api/article', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: t, action: 'publish' }),
    });
    fetchArticles();
  };

  const saveArticle = async () => {
    if (!selectedArticle) return;
    await fetch('/api/article', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: selectedArticle.topic, action: 'edit', content: editContent }),
    });
    fetchArticles();
    modalRef.current?.close();
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
              {art.status.replace('_', ' ')}
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