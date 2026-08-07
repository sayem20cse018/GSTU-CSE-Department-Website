'use client';
/**
 * ImageUpload — converts picked file to base64 data URL.
 * Works without any external service.
 * Optionally uploads to Cloudinary if env vars are set.
 */

import { useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxMB?: number;
  previewRounded?: boolean;
  dark?: boolean;  // true = dark modal bg (default), false = light bg
}

const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function resizeAndBase64(file: File): Promise<string> {
  const dataUrl = await toBase64(file);

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const maxDimension = 1600;
      let width = image.width;
      let height = image.height;
      if (width > maxDimension || height > maxDimension) {
        const ratio = maxDimension / Math.max(width, height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Unable to get canvas context')); return;
      }
      ctx.drawImage(image, 0, 0, width, height);

      const outputType = file.type === 'image/png' ? 'image/png' : 'image/webp';
      const resized = canvas.toDataURL(outputType, 0.8);
      resolve(resized);
    };
    image.onerror = reject;
    image.src = dataUrl;
  });
}

async function uploadFile(file: File): Promise<string> {
  // Try Cloudinary only if both env vars present
  if (CLOUD_NAME && UPLOAD_PRESET) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', UPLOAD_PRESET);
    fd.append('folder', 'cse-dept');
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: fd },
    );
    if (res.ok) {
      const d = await res.json() as { secure_url: string };
      return d.secure_url;
    }
    // Cloudinary failed → fall back to resized base64 upload
  }

  // Resize + compress before base64 to keep payload small and avoid 413 errors
  return resizeAndBase64(file);
}

export default function ImageUpload({
  value, onChange, label = 'Image', accept = 'image/*', maxMB = 5,
  previewRounded = false, dark = true,
}: Props) {
  const inputRef          = useRef<HTMLInputElement>(null);
  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState('');

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
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
      const url = await uploadFile(file);
      onChange(url);
    } catch {
      setError('Upload failed — please try again.');
    } finally {
      setBusy(false);
    }
  }

  // Styling based on dark/light context
  const inputCls = dark
    ? 'w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2'
    : 'w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2';

  const labelCls   = dark ? 'block text-xs font-medium text-slate-300 mb-1' : 'block text-xs font-medium text-slate-600 mb-1';
  const hintCls    = dark ? 'text-[10px] text-slate-500 mt-1' : 'text-[10px] text-slate-400 mt-1';
  const previewBg  = dark ? 'border border-white/15 bg-white/5' : 'border border-slate-200 bg-slate-50';
  const btnStyle   = dark
    ? { background: 'rgba(22,163,74,0.2)', border: '1px solid rgba(74,222,128,0.3)', color: '#86efac' }
    : { background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.3)', color: '#166534' };

  const isDataUrl = value?.startsWith('data:');

  return (
    <div>
      <label className={labelCls}>{label}</label>

      <div className="flex items-start gap-3">
        {/* Preview */}
        {value && (
          <div className={`w-16 h-16 shrink-0 overflow-hidden flex items-center justify-center ${previewBg} ${previewRounded ? 'rounded-full' : 'rounded-lg'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-cover"
              onError={() => onChange('')}/>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* URL input */}
          <input type="url"
            value={isDataUrl ? '' : (value ?? '')}
            onChange={e => { setError(''); onChange(e.target.value); }}
            placeholder="https://… or upload below"
            className={inputCls}
          />

          {/* File picker */}
          <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange}/>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
            style={btnStyle}>
            {busy ? (
              <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>Uploading…</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>Upload from computer</>
            )}
          </button>

          <p className={hintCls}>JPG, PNG, WebP, SVG · max {maxMB} MB</p>
        </div>

        {/* Remove */}
        {value && (
          <button type="button" onClick={() => { onChange(''); setError(''); }}
            className="shrink-0 text-xs text-red-400 hover:text-red-300 transition mt-1" title="Remove">
            ✕
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
