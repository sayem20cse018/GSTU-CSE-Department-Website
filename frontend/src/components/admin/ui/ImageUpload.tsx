'use client';
/**
 * ImageUpload — reusable image picker for admin forms.
 *
 * Strategy:
 *   1. User picks a file → validate type + size
 *   2. Upload to Cloudinary via unsigned upload preset
 *   3. Return the secure_url back through onChange()
 *
 * If NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 * are not set, falls back to base64 data-URL (stored directly in DB).
 *
 * Environment variables needed (frontend .env.local):
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 */

import { useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;       // default: image/*
  maxMB?: number;        // default: 5
  previewRounded?: boolean;
}

const CLOUD_NAME  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    // Fallback: base64 — works without Cloudinary but stores large strings in DB
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  fd.append('folder', 'cse-dept');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: fd },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err.error?.message ?? 'Cloudinary upload failed');
  }

  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}

export default function ImageUpload({
  value, onChange, label = 'Image', accept = 'image/*', maxMB = 5, previewRounded = false,
}: Props) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState('');

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting same file
    if (!file) return;

    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, SVG).');
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File too large — max ${maxMB} MB.`);
      return;
    }

    setBusy(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Try again.');
    } finally {
      setBusy(false);
    }
  }

  const isDataUrl = value?.startsWith('data:');

  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>

      <div className="flex items-start gap-3">
        {/* Preview */}
        {value && (
          <div className={`w-16 h-16 shrink-0 overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center ${previewRounded ? 'rounded-full' : 'rounded-lg'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => onChange('')}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* URL input */}
          <input
            type="url"
            value={isDataUrl ? '' : (value ?? '')}
            onChange={e => { setError(''); onChange(e.target.value); }}
            placeholder="https://… or upload below"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />

          {/* Upload button */}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(96,165,250,0.3)', color: '#93c5fd' }}
          >
            {busy ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Uploading…
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                Upload from computer
              </>
            )}
          </button>

          {!CLOUD_NAME && (
            <p className="text-[10px] text-amber-400/70 mt-1">
              ⚠️ Cloudinary not configured — using base64 (large file size in DB).
            </p>
          )}

          <p className="text-[10px] text-slate-600 mt-1">
            JPG, PNG, WebP, SVG · max {maxMB} MB
          </p>
        </div>

        {/* Remove */}
        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); setError(''); }}
            className="shrink-0 text-xs text-red-400 hover:text-red-300 transition mt-1"
            title="Remove image"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
