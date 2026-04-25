import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Image, MapPin, Play, Trash2, UploadCloud } from 'lucide-react';
import { deleteImage, getMyImages, uploadImage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const isVideo = (url) => url && /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(url);

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', caption: '', location: '', peoplePresent: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchImages() {
    try {
      const res = await getMyImages();
      setImages(res.data.images);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchImages(); }, []);

  function handleFile(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError('');
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return setError('Please select a file.');
    if (!form.title.trim()) return setError('Title is required.');
    setError('');
    setSuccess('');
    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      await uploadImage(data);
      setForm({ title: '', caption: '', location: '', peoplePresent: '' });
      setFile(null);
      setPreview('');
      setSuccess('Uploaded successfully.');
      fetchImages();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this item?')) return;
    try {
      await deleteImage(id);
      setImages(images.filter((img) => img.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    }
  }

  return (
    <main className="nest-shell px-4 py-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[270px_minmax(0,1fr)]">
        <aside className="nest-dark-card h-fit p-6 text-[var(--nest-paper)] xl:sticky xl:top-24">
          <p className="nest-label text-[var(--nest-copper-2)]">Creator studio</p>
          <h1 className="mt-3 font-display text-4xl font-black leading-tight">Your publishing nest</h1>
          <p className="mt-4 text-sm leading-7 text-white/65">
            Welcome, <span className="font-black text-[var(--nest-copper-2)]">{user?.name}</span>. Add media, metadata, and manage your public portfolio.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/[0.07] p-4">
              <p className="font-mono-custom text-3xl text-[var(--nest-copper-2)]">{images.length}</p>
              <p className="nest-label mt-2 text-white/45">Uploads</p>
            </div>
            <div className="rounded-2xl bg-white/[0.07] p-4">
              <p className="font-mono-custom text-3xl text-[var(--nest-copper-2)]">JWT</p>
              <p className="nest-label mt-2 text-white/45">Guarded</p>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <form onSubmit={handleUpload} className="nest-panel grid grid-cols-1 gap-5 p-5 lg:grid-cols-[310px_minmax(0,1fr)]">
            <label className="cursor-pointer overflow-hidden rounded-[18px] border border-dashed border-[var(--nest-line)] bg-[var(--nest-bg)] transition-colors hover:border-[var(--nest-copper)]">
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
              {preview ? (
                isVideo(file?.name) ? (
                  <video src={preview} className="h-72 w-full object-cover lg:h-full" muted preload="metadata" />
                ) : (
                  <img src={preview} alt="Preview" className="h-72 w-full object-cover lg:h-full" />
                )
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-[var(--nest-ink)] text-[var(--nest-copper-2)]">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-black text-[var(--nest-ink)]">Select media</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--nest-muted)]">Images and videos up to 200MB</p>
                </div>
              )}
            </label>

            <div className="grid content-start gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="nest-label text-[var(--nest-copper)]">Upload item</p>
                  <h2 className="mt-1 text-2xl font-black text-[var(--nest-ink)]">Create a gallery entry</h2>
                </div>
                <button type="submit" disabled={uploading} className="nest-btn disabled:cursor-not-allowed disabled:opacity-60">
                  <UploadCloud className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Publish'}
                </button>
              </div>

              <input className="nest-input" type="text" placeholder="Title *" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <textarea className="nest-input min-h-[108px] resize-none" placeholder="Caption" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input className="nest-input" type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <input className="nest-input" type="text" placeholder="People present" value={form.peoplePresent} onChange={(e) => setForm({ ...form, peoplePresent: e.target.value })} />
              </div>

              {error && <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"><AlertCircle className="h-4 w-4" /> {error}</div>}
              {success && <div className="flex items-center gap-2 rounded-xl border border-[var(--nest-line)] bg-[var(--nest-bg)] px-4 py-3 text-sm font-bold text-[var(--nest-forest)]"><CheckCircle className="h-4 w-4" /> {success}</div>}
            </div>
          </form>

          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="nest-label text-[var(--nest-muted)]">Portfolio library</p>
                <h2 className="mt-1 text-3xl font-black text-[var(--nest-ink)]">Uploaded media</h2>
              </div>
              <span className="font-mono-custom text-2xl text-[var(--nest-copper)]">{images.length}</span>
            </div>

            {loading ? (
              <div className="nest-card px-6 py-20 text-center text-sm font-bold text-[var(--nest-muted)]">Loading portfolio...</div>
            ) : images.length === 0 ? (
              <div className="nest-card px-6 py-20 text-center">
                <Image className="mx-auto mb-4 h-12 w-12 text-[var(--nest-muted)]" />
                <p className="font-black text-[var(--nest-ink)]">No media yet</p>
                <p className="mt-2 text-sm text-[var(--nest-muted)]">Publish your first photo or video above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((img) => {
                  const src = img.imageUrl.startsWith('http') ? img.imageUrl : `${API_URL}${img.imageUrl}`;
                  const video = isVideo(src);
                  return (
                    <article key={img.id} className="nest-card group overflow-hidden transition-transform hover:-translate-y-1">
                      <Link to={`/images/${img.id}`} className="relative block aspect-[4/3] overflow-hidden bg-[var(--nest-panel)]">
                        {video ? (
                          <video src={src} className="h-full w-full object-cover" controls preload="metadata" onClick={(e) => e.stopPropagation()} />
                        ) : (
                          <img src={src} alt={img.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.target.src = 'https://placehold.co/500x400/efe4d4/756a5b?text=SnapNest'; }} />
                        )}
                        {video && <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-black text-white"><Play className="mr-1 inline h-3 w-3 fill-white" />Video</span>}
                      </Link>
                      <div className="flex items-start justify-between gap-3 p-4">
                        <div className="min-w-0">
                          <p className="truncate font-black text-[var(--nest-ink)]">{img.title}</p>
                          {img.location && <p className="mt-1 flex items-center gap-1 text-xs font-bold text-[var(--nest-muted)]"><MapPin className="h-3 w-3" /> {img.location}</p>}
                        </div>
                        <button onClick={() => handleDelete(img.id)} className="rounded-full bg-red-50 p-2 text-red-700 hover:bg-red-600 hover:text-white" aria-label="Delete media">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
