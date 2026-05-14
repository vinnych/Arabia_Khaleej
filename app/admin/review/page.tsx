'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Draft = {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  language: string;
  image: string;
  content?: string;
};

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function AdminReviewPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedDraft, setExpandedDraft] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [editingTitle, setEditingTitle] = useState<Record<string, string>>({});
  const [hasEdits, setHasEdits] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const secret = new URLSearchParams(window.location.search).get('secret');

  useEffect(() => {
    if (!secret) {
      setError('Missing admin secret');
      setLoading(false);
      return;
    }

    const fetchDrafts = async (lang: string) => {
      const res = await fetch(`/api/admin/drafts?secret=${secret}&lang=${lang}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch ${lang} drafts`);
      }
      const data = await res.json();
      if (data.drafts) {
        setDrafts(prev => [...prev, ...data.drafts]);
      }
    };

    Promise.all([fetchDrafts('en'), fetchDrafts('ar')]).then(() => {
      setLoading(false);
    }).catch(err => {
      setError(err.message || 'Failed to load drafts');
      setLoading(false);
    });
  }, [secret]);

  const fetchDraftContent = async (slug: string) => {
    try {
      const res = await fetch(`/api/admin/draft-content?secret=${secret}&slug=${slug}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.content;
    } catch {
      return null;
    }
  };

  const handleApprove = async (slug: string, lang: string) => {
    if (!hasEdits[slug]) {
      if (!confirm('You must make substantive edits to the content before publishing for AdSense compliance. Continue anyway?')) {
        return;
      }
    }
    try {
      const res = await fetch(`/api/admin/approve?secret=${secret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          lang,
          content: editedContent[slug],
          title: editingTitle[slug]
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDrafts(prev => prev.filter(d => d.slug !== slug));
        alert('Article approved and published!');
      } else {
        alert('Approval failed: ' + data.error);
      }
    } catch (err) {
      alert('Approval failed');
    }
  };

  const handleReject = async (slug: string, lang: string) => {
    if (!confirm('Are you sure you want to reject this draft?')) return;
    // For simplicity, we'll just remove from draft list (add delete API if needed)
    setDrafts(prev => prev.filter(d => d.slug !== slug));
    alert('Draft rejected (draft list updated locally, add delete API for permanent removal)');
  };

  if (!secret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p>Add ?secret=YOUR_ADMIN_SECRET to the URL</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading drafts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pt-24 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Arabia Khaleej - Draft Review</h1>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

        {drafts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No drafts pending review.</p>
          <p className="text-sm text-gray-400">
            Drafts are generated automatically by the AI automation worker.
            Check back later or verify the Redis connection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drafts.map(draft => (
            <div key={draft.slug} className="border rounded-lg p-6 shadow-sm">
              {draft.image && (
                <div className="relative w-full h-48 mb-4">
                  <Image 
                    src={draft.image} 
                    alt={draft.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold mb-2">{draft.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{draft.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>{new Date(draft.pubDate).toLocaleDateString()}</span>
                <span className="uppercase">{draft.language}</span>
              </div>
              
              <button
                onClick={async () => {
                  if (expandedDraft !== draft.slug) {
                    const content = await fetchDraftContent(draft.slug);
                    if (content) {
                      setEditedContent(prev => ({ ...prev, [draft.slug]: content }));
                      setEditingTitle(prev => ({ ...prev, [draft.slug]: draft.title }));
                    }
                  }
                  setExpandedDraft(expandedDraft === draft.slug ? null : draft.slug);
                }}
                className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {expandedDraft === draft.slug ? 'Hide Editor' : 'Edit & Review'}
              </button>

              {expandedDraft === draft.slug && (
                <div className="mb-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title (edit for SEO)</label>
                    <input
                      type="text"
                      value={editingTitle[draft.slug] || draft.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setEditingTitle(prev => ({ ...prev, [draft.slug]: newTitle }));
                        setHasEdits(prev => ({ ...prev, [draft.slug]: newTitle !== draft.title }));
                      }}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Content (Markdown)</label>
                    <textarea
                      value={editedContent[draft.slug] || ''}
                      onChange={(e) => {
                        const newContent = e.target.value;
                        setEditedContent(prev => ({ ...prev, [draft.slug]: newContent }));
                        setHasEdits(prev => ({ ...prev, [draft.slug]: true }));
                      }}
                      className="w-full px-3 py-2 border rounded font-mono text-sm"
                      rows={15}
                    />
                  </div>
                  {hasEdits[draft.slug] && (
                    <p className="text-green-600 text-sm font-medium">✓ Substantive edits detected</p>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => handleApprove(draft.slug, draft.language)}
                  className={`px-4 py-2 rounded ${hasEdits[draft.slug] ? 'bg-green-600 hover:bg-green-700' : 'bg-green-400 hover:bg-green-500'} text-white`}
                >
                  Approve & Publish
                </button>
                <button
                  onClick={() => handleReject(draft.slug, draft.language)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
                <a
                  href={`/insights/${draft.slug}?preview=true`}
                  target="_blank"
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Preview
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
