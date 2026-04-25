import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bookmark,
  Camera,
  Cloud,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Search,
  ShieldCheck,
  Star,
  UploadCloud,
  Users,
} from 'lucide-react';

const features = [
  { icon: UploadCloud, title: 'Creator publishing', text: 'Upload photos and videos with captions, places, and people metadata.' },
  { icon: Search, title: 'Curated discovery', text: 'Browse and search visual work through a dedicated consumer experience.' },
  { icon: MessageCircle, title: 'Community actions', text: 'Like, save, rate, comment, share, and follow creators.' },
];

const proof = [
  { icon: ShieldCheck, label: 'Role-based access' },
  { icon: Cloud, label: 'Cloud-ready REST app' },
  { icon: Bookmark, label: 'Saved collections' },
];

const galleryTiles = [
  {
    title: 'City light walk',
    meta: 'Photography',
    className: 'col-span-2 row-span-2',
    background: 'linear-gradient(135deg, #26382f 0%, #3f745b 42%, #d18a57 100%)',
  },
  {
    title: 'Quiet studio',
    meta: 'Portrait',
    className: 'col-span-1 row-span-1',
    background: 'linear-gradient(135deg, #f1d7ad 0%, #b56535 100%)',
  },
  {
    title: 'Saved set',
    meta: 'Collection',
    className: 'col-span-1 row-span-1',
    background: 'linear-gradient(135deg, #e9dfcf 0%, #7f9d88 100%)',
  },
];

const metrics = [
  { label: 'Creators', value: '128', icon: Users },
  { label: 'Ratings', value: '4.8', icon: Star },
  { label: 'Saved', value: '2.4k', icon: Bookmark },
];

export default function LandingPage() {
  return (
    <div className="nest-shell">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 items-center gap-9 lg:min-h-[660px] lg:grid-cols-[minmax(0,0.9fr)_minmax(430px,0.82fr)]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--nest-line)] bg-[var(--nest-paper)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--nest-copper)]">
              <Camera className="h-3.5 w-3.5" />
              Scalable media sharing platform
            </div>

            <h1 className="text-4xl font-black leading-[1.04] tracking-normal text-[var(--nest-ink)] sm:text-5xl lg:text-6xl">
              Share photographs. Discover visual stories.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--nest-muted)]">
              SnapNest gives creators a refined publishing workspace and gives consumers a calm gallery for
              searching, saving, rating, and discussing photos and videos.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="nest-btn px-6 py-4">
                Start exploring <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="nest-btn-outline px-6 py-4">
                Sign in
              </Link>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {proof.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-[var(--nest-line)] bg-[rgba(255,250,242,0.82)] px-4 py-3">
                  <Icon className="h-4 w-4 shrink-0 text-[var(--nest-copper)]" />
                  <span className="text-sm font-black text-[var(--nest-ink)]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="nest-panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--nest-line)] bg-[rgba(255,250,242,0.86)] px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--nest-copper)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--nest-copper-2)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--nest-forest)]" />
                </div>
                <p className="text-sm font-black text-[var(--nest-ink)]">SnapNest workspace</p>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-[1fr_180px]">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="nest-label text-[var(--nest-copper)]">Creator studio</p>
                      <h2 className="mt-1 text-2xl font-black text-[var(--nest-ink)]">Gallery queue</h2>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--nest-forest)] px-3 py-2 text-xs font-black text-white">
                      <UploadCloud className="h-3.5 w-3.5" />
                      Upload
                    </span>
                  </div>

                  <div className="grid h-[340px] grid-cols-3 grid-rows-2 gap-3">
                    {galleryTiles.map((tile) => (
                      <div
                        key={tile.title}
                        className={`${tile.className} relative overflow-hidden rounded-2xl border border-white/40 p-4 text-white`}
                        style={{ background: tile.background }}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.28),transparent_23%),radial-gradient(circle_at_76%_68%,rgba(255,255,255,0.16),transparent_18%)]" />
                        <div className="relative flex h-full flex-col justify-between">
                          <ImageIcon className="h-5 w-5 text-white/85" />
                          <div>
                            <p className="text-sm font-black">{tile.title}</p>
                            <p className="mt-1 text-xs font-bold text-white/70">{tile.meta}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="rounded-2xl bg-[#18231d] p-4 text-[var(--nest-paper)]">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="nest-label text-[var(--nest-copper-2)]">Live board</p>
                    <Camera className="h-5 w-5 text-[var(--nest-copper-2)]" />
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-xl bg-white/[0.08] p-3">
                      <Heart className="mb-6 h-5 w-5 text-[var(--nest-copper-2)]" />
                      <p className="text-2xl font-black">Save</p>
                      <p className="mt-1 text-xs font-bold text-white/55">Consumer collections</p>
                    </div>
                    <div className="rounded-xl bg-[var(--nest-copper-2)] p-3 text-[var(--nest-ink)]">
                      <MessageCircle className="mb-6 h-5 w-5" />
                      <p className="text-2xl font-black">Discuss</p>
                      <p className="mt-1 text-xs font-black text-[rgba(23,33,27,0.66)]">Comments and ratings</p>
                    </div>
                  </div>
                </aside>
              </div>

              <div className="grid grid-cols-3 border-t border-[var(--nest-line)] bg-[rgba(247,240,230,0.82)]">
                {metrics.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="border-r border-[var(--nest-line)] px-4 py-4 last:border-r-0">
                    <div className="mb-2 flex items-center gap-2 text-[var(--nest-copper)]">
                      <Icon className="h-4 w-4" />
                      <p className="nest-label">{label}</p>
                    </div>
                    <p className="text-2xl font-black text-[var(--nest-ink)]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--nest-line)] bg-[rgba(255,250,242,0.6)] px-4 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="nest-card p-5">
              <Icon className="mb-5 h-6 w-6 text-[var(--nest-forest)]" />
              <h2 className="text-lg font-black text-[var(--nest-ink)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--nest-muted)]">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
