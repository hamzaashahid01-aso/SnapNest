import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { addComment } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ imageId, comments: initial, onAdd }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initial || []);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await addComment(imageId, { commentText: text.trim() });
      const newComment = { ...res.data, user: { id: user.id, name: user.name } };
      setComments([newComment, ...comments]);
      setText('');
      if (onAdd) onAdd();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post comment.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="nest-panel p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-black text-[var(--nest-ink)]">Comments</h3>
        <span className="rounded-full bg-[var(--nest-bg)] px-3 py-1 text-xs font-black text-[var(--nest-muted)]">{comments.length}</span>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment" className="nest-input flex-1" />
            <button type="submit" disabled={loading || !text.trim()} className="nest-btn px-4 disabled:cursor-not-allowed disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </div>
          {error && <p className="mt-2 text-xs font-bold text-red-700">{error}</p>}
        </form>
      )}

      <div className="space-y-3">
        {comments.length === 0 && <p className="rounded-2xl bg-[var(--nest-bg)] px-4 py-5 text-sm font-bold text-[var(--nest-muted)]">No comments yet. Start the discussion.</p>}
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-2xl bg-[var(--nest-bg)] p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-black text-[var(--nest-ink)]">{comment.user?.name}</span>
              <span className="text-xs font-bold text-[var(--nest-muted)]">{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm leading-6 text-[var(--nest-muted)]">{comment.commentText}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
