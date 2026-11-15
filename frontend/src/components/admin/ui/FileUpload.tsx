'use client';
/**
 * FileUpload — uploads images and PDFs to Cloudinary, or accepts URL input.
 * Images: uses Cloudinary image upload (with canvas resize fallback)
 * PDFs: uses Cloudinary raw file upload
 */
import { useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (url: string, fileName?: string) => void;
  label?: string;
  accept?: string;
  maxMB?: number;
  hint?: string;
}

const CLOUD  = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

async function uploadToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', PRESET!);
  fd.append('folder', 'cse-dept');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  const d = await res.json() as { secure_url: string };
  return d.secure_url;
}

function resizeBase64(file: File, maxPx = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width > height) { height = Math.round(height * maxPx / width); width = maxPx; }
        else { width = Math.round(width * maxPx / height); height = maxPx; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not available')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

export default function FileUpload({
  value, onChange, label = 'File', accept = 'image/*,application/pdf',
  maxMB = 10, hint,
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const isImage = accept.includes('image');
  const isPdf = accept.includes('pdf') || accept.includes('application/pdf');

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    setErr('');
    if (file.size > maxMB * 1024 * 1024) { setErr(`Max ${maxMB} MB.`); return; }

    setBusy(true);
    try {
      let url: string;
      if (file.type.startsWith('image/') && CLOUD && PRESET) {
        // Try Cloudinary first, fall back to base64
        try { url = await uploadToCloudinary(file); }
        catch { url = await resizeBase64(file); }
      } else if (CLOUD && PRESET) {
        // PDF or other file — use Cloudinary auto upload
        url = await uploadToCloudinary(file);
      } else if (file.type.startsWith('image/')) {
        url = await resizeBase64(file);
      } else {
        throw new Error('Cloudinary not configured for file uploads. Please paste a URL.');
      }
      onChange(url, file.name);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  const isPdfUrl = value && (value.endsWith('.pdf') || value.includes('.pdf'));
  const isImageUrl = value && (value.startsWith('data:') || value.match(/\.(jpg|jpeg|png|webp|gif)/i));

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <div className="flex items-start gap-3">
        {/* Preview */}
        {value && (
          <div className="w-16 h-16 shrink-0 overflow-hidden border border-slate-200 bg-slate-50 rounded-lg flex items-center justify-center">
            {isPdfUrl ? (
              <span className="text-2xl">📄</span>
            ) : isImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="w-full h-full object-cover" onError={() => onChange('')} />
            ) : (
              <span className="text-2xl">📎</span>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {/* URL input */}
          <input type="url" value={value?.startsWith('data:') ? '' : (value ?? '')}
            onChange={e => { setErr(''); onChange(e.target.value); }}
            placeholder="https://… or upload below"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white mb-2" />
          {/* Upload button */}
          <input ref={ref} type="file" accept={accept} className="hidden" onChange={handleChange} />
          <button type="button" onClick={() => ref.current?.click()} disabled={busy}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50
                       bg-green-50 border border-green-300 text-green-700 hover:bg-green-100">
            {busy ? (
              <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>Uploading…</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>Upload File</>
            )}
          </button>
          <p className="text-[10px] text-slate-400 mt-1">
            {hint ?? `Images and PDFs · auto-compressed · max ${maxMB} MB`}
          </p>
        </div>
        {value && (
          <button type="button" onClick={() => { onChange(''); setErr(''); }}
            className="shrink-0 text-xs text-red-400 hover:text-red-600 transition mt-1" title="Remove">✕</button>
        )}
      </div>
      {err && <p className="mt-1.5 text-xs text-red-500">{err}</p>}
    </div>
  );
}