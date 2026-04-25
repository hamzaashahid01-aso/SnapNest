import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Calendar, Heart, Image, Mail, MessageCircle, Upload, UserCheck, Users } from 'lucide-react';
import { getMyImages, getMyProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const isVideo = (url) => url && /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(url);

function Stat({ label, value, icon: Icon }) {
  return (
    <div className="nest-card p-4">
      <Icon className="mb-4 h-5 w-5 text-[var(--nest-copper)]" />
      <p className="font-mono-custom text-3xl text-[var(--nest-ink)]">{value ?? 0}</p>
      <p className="nest-label mt-2 text-[var(--nest-muted)]">{label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myImages, setMyImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getMyProfile();
        setProfile(res.data);
        if (res.data.role === 'creator') {
          const imgRes = await getMyImages();
          setMyImages(imgRes.data.images || []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <main className="nest-shell flex items-center justify-center text-sm font-bold text-[var(--nest-muted)]">Loading profile...</main>;
  }
  if (!profile) return null;

  const isCreator = profile.role === 'creator';
  const stats = isCreator ? [
    { label: 'Posts', value: profile.stats.posts, icon: Upload },
    { label: 'Likes', value: profile.stats.likesReceived, icon: Heart },
    { label: 'Followers', value: profile.stats.followers, icon: Users },
    { label: 'Comments', value: profile.stats.comments, icon: MessageCircle },
  ] : [
    { label: 'Liked', value: profile.stats.likesGiven, icon: Heart },
    { label: 'Saved', value: profile.stats.bookmarks, icon: Bookmark },
    { label: 'Following', value: profile.stats.following, icon: UserCheck },
    { label: 'Comments', value: profile.stats.comments, icon: MessageCircle },
  ];

  return (
    <main className="nest-shell px-4 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="nest-dark-card h-fit p-7 text-[var(--nest-paper)] lg:sticky lg:top-24">
          <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-[var(--nest-copper-2)] text-3xl font-black text-[var(--nest-ink)]">
            {profile.name?.[0]?.toUpperCase()}
          </div>
          <p className="nest-label text-[var(--nest-copper-2)]">{isCreator ? 'Creator profile' : 'Consumer profile'}</p>
          <h1 className="mt-3 font-display text-4xl font-black leading-tight">{profile.name}</h1>
          <p className="mt-4 flex items-center gap-2 break-all text-sm text-white/65"><Mail className="h-4 w-4" /> {profile.email}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/45"><Calendar className="h-4 w-4" /> Member since {new Date(profile.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
          <Link to={isCreator ? '/creator' : '/feed'} className="nest-btn-dark mt-7 w-full">
            {isCreator ? 'Open studio' : 'Browse feed'}
          </Link>
        </aside>

        <section>
          <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
            {stats.map((stat) => <Stat key={stat.label} {...stat} />)}
          </div>

          {isCreator ? (
            <div className="nest-panel p-5">
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="nest-label text-[var(--nest-copper)]">Creator uploads</p>
                  <h2 className="mt-2 text-3xl font-black text-[var(--nest-ink)]">Portfolio preview</h2>
                </div>
                <span className="font-mono-custom text-2xl text-[var(--nest-copper)]">{myImages.length}</span>
              </div>
              {myImages.length === 0 ? (
                <p className="py-12 text-center text-sm font-bold text-[var(--nest-muted)]">
                  No uploads yet. <Link to="/creator" className="text-[var(--nest-forest)]">Publish your first item.</Link>
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                  {myImages.slice(0, 16).map((img) => {
                    const src = img.imageUrl.startsWith('http') ? img.imageUrl : `${API_URL}${img.imageUrl}`;
                    return (
                      <Link key={img.id} to={`/images/${img.id}`} className="aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--nest-panel)]">
                        {isVideo(src)
                          ? <video src={src} className="h-full w-full object-cover" preload="metadata" muted />
                          : <img src={src} alt={img.title} className="h-full w-full object-cover" onError={(e) => { e.target.src = 'https://placehold.co/400x500/efe4d4/756a5b?text=SnapNest'; }} />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Link to="/feed" className="nest-panel p-6 no-underline transition-transform hover:-translate-y-1">
                <Heart className="mb-5 h-7 w-7 text-[var(--nest-copper)]" />
                <p className="text-xl font-black text-[var(--nest-ink)]">Discover more work</p>
                <p className="mt-2 text-sm leading-6 text-[var(--nest-muted)]">Browse the feed to like, save, rate, and comment on creator uploads.</p>
              </Link>
              <Link to="/bookmarks" className="nest-panel p-6 no-underline transition-transform hover:-translate-y-1">
                <Image className="mb-5 h-7 w-7 text-[var(--nest-copper)]" />
                <p className="text-xl font-black text-[var(--nest-ink)]">Review saved media</p>
                <p className="mt-2 text-sm leading-6 text-[var(--nest-muted)]">Return to the content you bookmarked for later.</p>
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
