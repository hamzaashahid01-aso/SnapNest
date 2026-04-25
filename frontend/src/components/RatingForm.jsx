import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { rateImage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RatingForm({ imageId, avgRating, totalRatings, onRate }) {
  const { isConsumer } = useAuth();
  const [selected, setSelected] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleRate(value) {
    if (!isConsumer) return;
    setLoading(true);
    setMessage('');
    try {
      await rateImage(imageId, { ratingValue: value });
      setSelected(value);
      setMessage('Rating saved.');
      if (onRate) onRate();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to rate.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="nest-panel p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-black text-[var(--nest-ink)]">Rating</h3>
        <span className="text-sm font-bold text-[var(--nest-muted)]">
          {avgRating !== null ? `${avgRating}/5 (${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'})` : 'No ratings yet'}
        </span>
      </div>
      {isConsumer && (
        <>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = star <= (hover || selected);
              return (
                <button key={star} type="button" onClick={() => handleRate(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} disabled={loading} className="rounded-full p-1 transition-transform hover:scale-110 disabled:opacity-50" aria-label={`Rate ${star} out of 5`}>
                  <Star className={`h-6 w-6 ${active ? 'fill-[var(--nest-copper)] text-[var(--nest-copper)]' : 'text-[var(--nest-line)]'}`} />
                </button>
              );
            })}
          </div>
          {message && <p className={`mt-2 text-xs font-bold ${message.includes('Failed') ? 'text-red-700' : 'text-[var(--nest-forest)]'}`}>{message}</p>}
        </>
      )}
    </section>
  );
}
