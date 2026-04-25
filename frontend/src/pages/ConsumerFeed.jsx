import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ChevronLeft, ChevronRight, Grid3x3, Heart, ImageOff, LayoutList, MapPin, MessageCircle, Play, Search, Share2, X } from 'lucide-react';
import { getFeed, searchImages, toggleBookmark, toggleLike } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const isVideo = (url) => url && /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(url);
const TOPICS = ['Landscapes', 'Portraits', 'Travel', 'Architecture', 'Wildlife', 'Fine Art'];

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function FeedCard({ image }) {
  const [liked, setLiked] = useState(image.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(image._count?.likes ?? 0);
  const [bookmarked, setBookmarked] = useState(image.isBookmarked ?? false);
  const [toast, setToast] = useState(false);
  const src = image.imageUrl.startsWith('http') ? image.imageUrl : `${API_URL}${image.imageUrl}`;
  const video = isVideo(src);

  async function onLike(e) {
    e.preventDefault();
    const r = await toggleLike(image.id);
    setLiked(r.data.liked);
    setLikeCount(r.data.likeCount);
  }

  async function onBookmark(e) {
    e.preventDefault();
    const r = await toggleBookmark(image.id);
    setBookmarked(r.data.bookmarked);
  }

  function onShare(e) {
    e.preventDefault();
    navigator.clipboard.writeText(`${window.location.origin}/images/${image.id}`);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }

  return (
    <article className="nest-card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_260px] items-start">
        <Link to={`/images/${image.id}`} className="relative block bg-[var(--nest-panel)]">
          {video ? (
            <div className="aspect-video w-full bg-black">
              <video src={src} className="w-full h-full" controls preload="metadata" />
            </div>
          ) : (
            <img src={src} alt={image.title} className="w-full block object-cover" style={{ maxHeight: '480px', minHeight: '200px' }} onError={(e) => { e.target.src = 'https://placehold.co/700x600/efe4d4/756a5b?text=SnapNest'; }} />
          )}
          {video && <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-black text-white"><Play className="mr-1 inline h-3 w-3 fill-white" />Video</span>}
        </Link>

        <div className="flex flex-col p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--nest-ink)] text-sm font-black text-[var(--nest-copper-2)]">
              {image.creator?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[var(--nest-ink)]">{image.creator?.name}</p>
              <p className="text-xs font-bold text-[var(--nest-muted)]">{timeAgo(image.createdAt)} ago</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-[var(--nest-ink)]">{image.title}</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--nest-muted)]">{image.caption || image.title}</p>
          {image.location && <p className="mt-3 flex items-center gap-1 text-xs font-black text-[var(--nest-copper)]"><MapPin className="h-3.5 w-3.5" /> {image.location}</p>}

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
            <button onClick={onLike} className={`rounded-full px-3 py-2 text-sm font-black ${liked ? 'bg-[var(--nest-forest)] text-white' : 'bg-[var(--nest-panel)] text-[var(--nest-muted)] hover:text-[var(--nest-ink)]'}`}>
              <Heart className={`mr-1 inline h-4 w-4 ${liked ? 'fill-current' : ''}`} /> {likeCount}
            </button>
            <Link to={`/images/${image.id}`} className="rounded-full bg-[var(--nest-panel)] px-3 py-2 text-sm font-black text-[var(--nest-muted)] no-underline hover:text-[var(--nest-ink)]">
              <MessageCircle className="mr-1 inline h-4 w-4" /> {image._count?.comments ?? 0}
            </Link>
            <button onClick={onShare} className="rounded-full bg-[var(--nest-panel)] px-3 py-2 text-sm font-black text-[var(--nest-muted)] hover:text-[var(--nest-ink)]">
              <Share2 className="mr-1 inline h-4 w-4" /> {toast ? 'Copied' : 'Share'}
            </button>
            <button onClick={onBookmark} className={`ml-auto rounded-full p-2 ${bookmarked ? 'bg-[var(--nest-copper)] text-white' : 'bg-[var(--nest-panel)] text-[var(--nest-muted)] hover:text-[var(--nest-ink)]'}`}>
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function GridCard({ image }) {
  const src = image.imageUrl.startsWith('http') ? image.imageUrl : `${API_URL}${image.imageUrl}`;
  const video = isVideo(src);
  return (
    <Link to={`/images/${image.id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[18px] bg-[var(--nest-panel)]">
      {video ? <video src={src} className="h-full w-full object-cover" muted preload="metadata" /> : <img src={src} alt={image.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.target.src = 'https://placehold.co/500x650/efe4d4/756a5b?text=SnapNest'; }} />}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="text-white">
          <p className="font-black">{image.title}</p>
          <p className="mt-1 text-xs font-bold text-white/75">{image._count?.likes ?? 0} likes - {image._count?.comments ?? 0} comments</p>
        </div>
      </div>
    </Link>
  );
}

export default function ConsumerFeed() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [viewMode, setViewMode] = useState('feed');

  async function fetchFeed(p = 1) {
    setLoading(true);
    try {
      const res = await getFeed(p);
      setImages(res.data.images);
      setTotalPages(res.data.pages);
      setPage(p);
      setIsSearchMode(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return fetchFeed(1);
    setSearching(true);
    try {
      const res = await searchImages(query);
      setImages(res.data.images);
      setIsSearchMode(true);
      setTotalPages(1);
    } finally {
      setSearching(false);
    }
  }

  function clearSearch() {
    setQuery('');
    fetchFeed(1);
  }

  useEffect(() => { fetchFeed(1); }, []);

  return (
    <main className="nest-shell px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <header className="nest-panel mb-6 grid grid-cols-1 gap-5 p-5 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="nest-label text-[var(--nest-copper)]">{isSearchMode ? 'Search results' : 'Curated discovery'}</p>
            <h1 className="mt-2 font-display text-5xl font-black text-[var(--nest-ink)]">{isSearchMode ? `"${query}"` : 'Today in the nest'}</h1>
            <p className="mt-3 text-sm leading-7 text-[var(--nest-muted)]">Hello, <span className="font-black text-[var(--nest-forest)]">{user?.name}</span>. Browse visual work from creators and save the pieces that matter.</p>
          </div>

          <div className="grid content-between gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--nest-muted)]" />
                <input className="nest-input pl-10 pr-10" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search media, people, places" />
                {query && <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--nest-muted)]"><X className="h-4 w-4" /></button>}
              </div>
              <button type="submit" disabled={searching} className="nest-btn px-5 disabled:opacity-60">{searching ? '...' : 'Go'}</button>
            </form>
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                {TOPICS.map((topic) => <span key={topic} className="shrink-0 rounded-full border border-[var(--nest-line)] bg-[var(--nest-bg)] px-3 py-1 text-xs font-black text-[var(--nest-muted)]">{topic}</span>)}
              </div>
              <div className="shrink-0 flex rounded-full border border-[var(--nest-line)] bg-[var(--nest-bg)] p-1">
                <button onClick={() => setViewMode('feed')} className={`rounded-full p-2 ${viewMode === 'feed' ? 'bg-[var(--nest-ink)] text-white' : 'text-[var(--nest-muted)]'}`}><LayoutList className="h-4 w-4" /></button>
                <button onClick={() => setViewMode('grid')} className={`rounded-full p-2 ${viewMode === 'grid' ? 'bg-[var(--nest-ink)] text-white' : 'text-[var(--nest-muted)]'}`}><Grid3x3 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </header>

        {isSearchMode && (
          <div className="nest-card mb-5 flex items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--nest-muted)]">
            <Search className="h-4 w-4 text-[var(--nest-copper)]" />
            {images.length} result{images.length !== 1 ? 's' : ''} found.
            <button onClick={clearSearch} className="ml-auto font-black text-[var(--nest-forest)]">Clear</button>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Loading feed..." />
        ) : images.length === 0 ? (
          <div className="nest-card px-6 py-24 text-center">
            <ImageOff className="mx-auto mb-4 h-12 w-12 text-[var(--nest-muted)]" />
            <p className="font-black text-[var(--nest-ink)]">Nothing here yet</p>
            <p className="mt-2 text-sm text-[var(--nest-muted)]">{isSearchMode ? 'Try another search.' : "Creators haven't posted anything yet."}</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {images.map((img) => <GridCard key={img.id} image={img} />)}
          </div>
        ) : (
          <div className="space-y-5">
            {images.map((img) => <FeedCard key={img.id} image={img} />)}
          </div>
        )}

        {!isSearchMode && !loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button onClick={() => fetchFeed(page - 1)} disabled={page <= 1} className="nest-btn-outline disabled:cursor-not-allowed disabled:opacity-50"><ChevronLeft className="h-4 w-4" /> Prev</button>
            <span className="rounded-full border border-[var(--nest-line)] bg-[var(--nest-paper)] px-5 py-3 text-sm font-black text-[var(--nest-ink)]">{page} / {totalPages}</span>
            <button onClick={() => fetchFeed(page + 1)} disabled={page >= totalPages} className="nest-btn-outline disabled:cursor-not-allowed disabled:opacity-50">Next <ChevronRight className="h-4 w-4" /></button>
          </div>
        )}
      </div>
    </main>
  );
}
