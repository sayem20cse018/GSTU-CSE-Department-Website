'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface MediaItem { id?: string; url: string; thumbnailUrl: string; caption?: string; altText?: string; mediaType?: string }
interface Album {
  id: string; title: string; slug: string; description?: string; category: string;
  mediaCount: number; albumDate: string; coverImage?: string;
  media: MediaItem[];
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function GalleryAlbumPage() {
  const { slug } = useParams<{ slug: string }>();
  const [album,     setAlbum]     = useState<Album | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [lightbox,  setLightbox]  = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
    fetch(`${api}/gallery/${slug}`)
      .then(r => r.json())
      .then(d => {
        const raw = (d as { data?: Album }).data ?? d as Album;
        setAlbum(raw);
      })
      .catch(() => setAlbum(null))
      .finally(() => setLoading(false));
  }, [slug]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null || !album) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightbox(i => Math.min((i ?? 0) + 1, album.media.length - 1));
      if (e.key === 'ArrowLeft')  setLightbox(i => Math.max((i ?? 0) - 1, 0));
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, album]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin"/>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">🖼️</p>
        <p className="text-slate-600 font-semibold">Album not found</p>
        <Link href="/gallery" className="text-green-700 hover:underline text-sm">← Back to Gallery</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
        <div className="container-custom py-2.5">
          <nav className="text-sm text-slate-500 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <span>›</span>
            <Link href="/gallery" className="hover:text-slate-700">Gallery</Link>
            <span>›</span>
            <span className="text-slate-800 font-medium">{album.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Album header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
            <div>
              <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '0.03em' }}>
                {album.title}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                <span>📅 {fmtDate(album.albumDate)}</span>
                <span>·</span>
                <span className="capitalize">{album.category.replace(/_/g, ' ')}</span>
                <span>·</span>
                <span>📷 {album.media.length} photo{album.media.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <Link href="/gallery"
              className="shrink-0 text-sm font-semibold text-green-700 hover:text-green-800 flex items-center gap-1.5 border border-green-200 px-4 py-2 rounded-xl hover:bg-green-50 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              Back to Gallery
            </Link>
          </div>
          {album.description && (
            <p className="text-slate-600 leading-relaxed max-w-3xl">{album.description}</p>
          )}
        </div>

        {/* Photo grid */}
        {album.media.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📷</p>
            <p className="text-slate-500 font-semibold">No photos in this album yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {album.media.map((photo, idx) => (
              <div key={idx} className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-xl border border-slate-200 hover:border-green-300 hover:shadow-lg transition-all"
                onClick={() => setLightbox(idx)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.altText || photo.caption || album.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                {/* Caption overlay */}
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium line-clamp-2">{photo.caption}</p>
                  </div>
                )}
                {/* Expand icon */}
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && album.media[lightbox] && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-5xl max-h-full w-full" onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-3xl font-light leading-none">✕</button>

            {/* Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={album.media[lightbox].url}
              alt={album.media[lightbox].caption || album.title}
              className="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg shadow-2xl block"/>

            {/* Caption */}
            {album.media[lightbox].caption && (
              <p className="text-center text-white/70 text-sm mt-3">{album.media[lightbox].caption}</p>
            )}

            {/* Counter */}
            <p className="text-center text-white/40 text-xs mt-2">{lightbox + 1} / {album.media.length}</p>

            {/* Prev/Next */}
            {lightbox > 0 && (
              <button onClick={() => setLightbox(i => (i ?? 1) - 1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
              </button>
            )}
            {lightbox < album.media.length - 1 && (
              <button onClick={() => setLightbox(i => (i ?? 0) + 1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
