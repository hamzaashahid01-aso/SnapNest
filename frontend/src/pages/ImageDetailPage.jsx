import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, Bookmark, Calendar, ChevronLeft, Heart, MapPin, Share2, Trash2, UserCheck, UserPlus, Users } from 'lucide-react';
import { deleteImage, getImage, toggleBookmark, toggleFollow, toggleLike } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';
import RatingForm from '../components/RatingForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const isVideo = (url) => url && /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(url);

function DetailButton({ active, children, className = '', ...props }) {
  return (
    <button type="button" className={`rounded-full px-3 py-2 text-sm font-black transition-colors disabled:opacity-60 ${active ? 'bg-[var(--nest-forest)] text-white' : 'bg-[var(--nest-panel)] text-[var(--nest-muted)] hover:text-[var(--nest-ink)]'} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default function ImageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCreator } = useAuth();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [shareToast, setShareToast] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  async function fetchImage() {
    try {
      const res = await getImage(id);
      const img = res.data;
      setImage(img);
      setLiked(img.isLiked ?? false);
      setLikeCount(img.likeCount ?? 0);
      setBookmarked(img.isBookmarked ?? false);
      setFollowing(img.isFollowing ?? false);
      setFollowerCount(img.followerCount ?? 0);
    } catch {
      setError('Media not found');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchImage(); }, [id]);

  async function handleDelete() {
    if (!window.confirm('Delete this item?')) return;
    try { await deleteImage(id); navigate('/creator'); }
    catch (err) { alert(err.response?.data?.error || 'Delete failed'); }
  }

  async function handleLike() {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await toggleLike(id);
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } finally {
      setLikeLoading(false);
    }
  }

  async function handleBookmark() {
    if (bookmarkLoading) return;
    setBookmarkLoading(true);
    try {
      const res = await toggleBookmark(id);
      setBookmarked(res.data.bookmarked);
    } finally {
      setBookmarkLoading(false);
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    });
  }

  async function handleFollow() {
    if (followLoading) return;
    setFollowLoading(true);
    try {
      const res = await toggleFollow(image.creator.id);
      setFollowing(res.data.following);
      setFollowerCount(res.data.followerCount);
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading) return <main className="nest-shell flex items-center justify-center"><LoadingSpinner /></main>;

  if (error || !image) {
    return (
      <main className="nest-shell flex items-center justify-center px-4 text-center">
        <div className="nest-panel max-w-md p-8">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-700" />
          <p className="font-black text-[var(--nest-ink)]">{error || 'Media not found'}</p>
          <button onClick={() => navigate(-1)} className="nest-btn mt-5">Go back</button>
        </div>
      </main>
    );
  }

  const src = image.imageUrl.startsWith('http') ? image.imageUrl : `${API_URL}${image.imageUrl}`;
  const video = isVideo(src);
  const isOwner = isCreator && image.creator?.id === user?.id;
  const canFollow = user?.role === 'consumer' && image.creator?.id !== user?.id;

  return (
    <main className="nest-shell px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--nest-paper)] px-4 py-2 text-sm font-black text-[var(--nest-muted)] hover:text-[var(--nest-ink)]">
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_400px] items-start">
          <section className="overflow-hidden rounded-[24px] bg-black shadow-[var(--nest-shadow)]">
            {video ? (
              <div className="aspect-video w-full">
                <video src={src} className="w-full h-full" controls preload="metadata" />
              </div>
            ) : (
              <img src={src} alt={image.title} className="w-full block" onError={(e) => { e.target.src = 'https://placehold.co/900x700/efe4d4/756a5b?text=SnapNest'; }} />
            )}
          </section>

          <aside className="space-y-4">
            <section className="nest-panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="nest-label text-[var(--nest-copper)]">{video ? 'Video entry' : 'Photo entry'}</p>
                  <h1 className="mt-2 text-3xl font-black text-[var(--nest-ink)]">{image.title}</h1>
                </div>
                {isOwner && (
                  <button onClick={handleDelete} className="rounded-full bg-red-50 p-3 text-red-700 hover:bg-red-600 hover:text-white" aria-label="Delete media">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="my-5 flex items-center gap-3 rounded-2xl bg-[var(--nest-bg)] p-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--nest-ink)] text-sm font-black text-[var(--nest-copper-2)]">
                  {image.creator?.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-[var(--nest-ink)]">{image.creator?.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-[var(--nest-muted)]"><Calendar className="h-3 w-3" /> {new Date(image.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <DetailButton onClick={handleLike} disabled={likeLoading} active={liked}><Heart className={`mr-1 inline h-4 w-4 ${liked ? 'fill-current' : ''}`} /> {likeCount}</DetailButton>
                {user?.role === 'consumer' && <DetailButton onClick={handleBookmark} disabled={bookmarkLoading} active={bookmarked}><Bookmark className={`mr-1 inline h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} /> {bookmarked ? 'Saved' : 'Save'}</DetailButton>}
                <DetailButton onClick={handleShare}><Share2 className="mr-1 inline h-4 w-4" /> {shareToast ? 'Copied' : 'Share'}</DetailButton>
                {canFollow && <DetailButton onClick={handleFollow} disabled={followLoading} active={following} className="ml-auto">{following ? <UserCheck className="mr-1 inline h-4 w-4" /> : <UserPlus className="mr-1 inline h-4 w-4" />}{following ? `Following - ${followerCount}` : `Follow - ${followerCount}`}</DetailButton>}
              </div>

              {image.caption && <p className="mt-5 text-sm leading-7 text-[var(--nest-muted)]">{image.caption}</p>}
              <div className="mt-5 flex flex-wrap gap-2">
                {image.location && <span className="rounded-full bg-[var(--nest-bg)] px-3 py-1.5 text-sm font-black text-[var(--nest-muted)]"><MapPin className="mr-1 inline h-4 w-4 text-[var(--nest-copper)]" /> {image.location}</span>}
                {image.peoplePresent && <span className="rounded-full bg-[var(--nest-bg)] px-3 py-1.5 text-sm font-black text-[var(--nest-muted)]"><Users className="mr-1 inline h-4 w-4 text-[var(--nest-copper)]" /> {image.peoplePresent}</span>}
              </div>
            </section>

            <RatingForm imageId={image.id} avgRating={image.avgRating} totalRatings={image.ratings?.length ?? 0} onRate={fetchImage} />
            <CommentSection imageId={image.id} comments={image.comments || []} onAdd={fetchImage} />
          </aside>
        </div>
      </div>
    </main>
  );
}
