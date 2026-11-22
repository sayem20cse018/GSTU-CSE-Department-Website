'use client';

/**
 * Reusable attachment list for PDFs and other documents.
 * Used across events, achievements, notices, and academic resources.
 */

interface Attachment {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSizeBytes?: number;
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(fileType?: string, fileName?: string): string {
  const ext = (fileType ?? fileName ?? '').toLowerCase();
  if (ext.includes('pdf')) return '📄';
  if (ext.includes('doc') || ext.includes('word')) return '📝';
  if (ext.includes('xls') || ext.includes('sheet') || ext.includes('csv')) return '📊';
  if (ext.includes('ppt') || ext.includes('presentation')) return '📊';
  if (ext.includes('zip') || ext.includes('rar') || ext.includes('tar')) return '🗜️';
  if (ext.match(/jpe?g|png|gif|webp|svg/)) return '🖼️';
  return '📎';
}

interface AttachmentListProps {
  attachments: Attachment[];
  title?: string;
  compact?: boolean;
}

export default function AttachmentList({
  attachments,
  title = 'Attachments',
  compact = false,
}: AttachmentListProps) {
  if (!attachments?.length) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {attachments.map((att, i) => (
          <a
            key={att.id ?? i}
            href={att.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-green-50 hover:border-green-300 transition text-xs font-medium text-slate-700 hover:text-green-800 max-w-[200px]"
            title={att.fileName}
          >
            <span className="text-sm shrink-0">{fileIcon(att.fileType, att.fileName)}</span>
            <span className="truncate">{att.fileName}</span>
            {att.fileSizeBytes && (
              <span className="text-slate-400 shrink-0 text-[10px]">{formatBytes(att.fileSizeBytes)}</span>
            )}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
          </svg>
          {title}
          <span className="text-xs text-slate-400 font-normal">({attachments.length})</span>
        </h4>
      )}
      <ul className="space-y-2">
        {attachments.map((att, i) => (
          <li key={att.id ?? i}>
            <a
              href={att.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-green-50 hover:border-green-300 transition group"
            >
              <span className="text-2xl shrink-0">{fileIcon(att.fileType, att.fileName)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 group-hover:text-green-800 truncate">{att.fileName}</p>
                {att.fileSizeBytes && (
                  <p className="text-xs text-slate-400 mt-0.5">{formatBytes(att.fileSizeBytes)}</p>
                )}
              </div>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-green-600 shrink-0 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
