import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, MessageCircle, Play, Star } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const isVideo = (url) => url && /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(url);

export default function ImageCard({ image }) {
  const src = image.imageUrl.startsWith('http') ? image.imageUrl : `${API_URL}${image.imageUrl}`;
  const video = isVideo(src);

  return (
    <Link to={`/images/${image.id}`} className="nest-card group block overflow-hidden no-underline transition-transform hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--nest-panel)]">
        {video ? (
          <video src={src} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" muted preload="metadata" />
        ) : (
          <img src={src} alt={image.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.target.src = 'https://placehold.co/500x650/efe4d4/756a5b?text=SnapNest'; }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {video && <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-black text-white"><Play className="mr-1 inline h-3 w-3 fill-white" />Video</span>}
        <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <p className="truncate font-black">{image.title}</p>
          {image.location && <p className="mt-1 flex items-center gap-1 text-xs font-bold text-white/75"><MapPin className="h-3 w-3" /> {image.location}</p>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="truncate text-sm font-black text-[var(--nest-ink)]">{image.title}</h3>
        <div className="mt-2 flex items-center justify-between gap-3 text-xs font-bold text-[var(--nest-muted)]">
          <span className="truncate text-[var(--nest-forest)]">{image.creator?.name}</span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{image._count?.likes ?? 0}</span>
            <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" />{image._count?.comments ?? 0}</span>
            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" />{image._count?.ratings ?? 0}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
