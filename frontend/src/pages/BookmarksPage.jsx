import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ImageOff } from 'lucide-react';
import { getBookmarks } from '../services/api';
import ImageCard from '../components/ImageCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BookmarksPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookmarks()
      .then((res) => setImages(res.data.bookmarks))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="nest-shell px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="nest-label text-[var(--nest-copper)]">Personal archive</p>
            <h1 className="mt-2 font-display text-5xl font-black text-[var(--nest-ink)]">Saved media</h1>
            <p className="mt-2 text-sm font-bold text-[var(--nest-muted)]">{images.length} bookmarked item{images.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--nest-ink)] text-[var(--nest-copper-2)]">
            <Bookmark className="h-7 w-7" />
          </div>
        </header>

        {loading ? (
          <LoadingSpinner message="Loading saved items..." />
        ) : images.length === 0 ? (
          <section className="nest-panel flex flex-col items-center justify-center px-6 py-24 text-center">
            <ImageOff className="mb-5 h-14 w-14 text-[var(--nest-muted)]" />
            <p className="text-xl font-black text-[var(--nest-ink)]">Nothing saved yet</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--nest-muted)]">Bookmark media on the detail page to collect your private gallery.</p>
            <Link to="/feed" className="nest-btn mt-6">Browse feed</Link>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {images.map((img) => <ImageCard key={img.id} image={img} />)}
          </div>
        )}
      </div>
    </main>
  );
}
