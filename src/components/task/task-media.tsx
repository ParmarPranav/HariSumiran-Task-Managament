'use client';

import React, { useState, useRef } from 'react';
import { Attachment } from '@/types';
import { useTaskStore } from '@/stores/task-store';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  UploadCloud,
  File,
  Film,
  Link2,
  X,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const maxDim = 1200;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        resolve(dataUrl);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    };
    img.onerror = () => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    };
    img.src = url;
  });
}

interface TaskMediaProps {
  taskId: string;
  attachments: Attachment[];
}

export function TaskMedia({ taskId, attachments = [] }: TaskMediaProps) {
  const updateTask = useTaskStore((state) => state.updateTask);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaName, setMediaName] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (filesList: File[]) => {
    let currentAttachments = [...attachments];
    for (const file of filesList) {
      try {
        const base64Url = await compressImageFile(file);
        const newAttachment: Attachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          size: `${(base64Url.length / 1024).toFixed(1)} KB`,
          type: file.type || 'image/jpeg',
          url: base64Url,
          uploadedAt: new Date().toISOString(),
        };

        currentAttachments = [...currentAttachments, newAttachment];
        updateTask(taskId, {
          attachments: currentAttachments,
        });
        toast.success(`Attached ${file.name}`);
      } catch (err) {
        console.error('File process error:', err);
        toast.error(`Failed to attach ${file.name}`);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(Array.from(files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) return;

    const newAttachment: Attachment = {
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: mediaName.trim() || mediaUrl.split('/').pop()?.split('?')[0] || 'Web Image',
      size: 'Remote URL',
      type: 'image/url',
      url: mediaUrl.trim(),
      uploadedAt: new Date().toISOString(),
    };

    updateTask(taskId, {
      attachments: [...attachments, newAttachment],
    });

    toast.success('Media link attached');
    setMediaUrl('');
    setMediaName('');
    setShowUrlInput(false);
  };

  const handleDelete = (attachmentId: string) => {
    updateTask(taskId, {
      attachments: attachments.filter((a) => a.id !== attachmentId),
    });
    toast.info('Media removed');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    processFiles(Array.from(files));
  };

  const isImage = (type: string, url: string) => {
    return (
      type.startsWith('image/') ||
      url.startsWith('data:image') ||
      url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) !== null
    );
  };

  return (
    <div className="space-y-4 text-xs select-none">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Upload Drag & Drop Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-zinc-400 dark:hover:border-zinc-700'
        }`}
      >
        <UploadCloud className="h-7 w-7 text-muted-foreground mb-2" />
        <p className="text-xs font-semibold text-foreground">
          Click to upload media or drag and drop
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          PNG, JPG, WebP, GIF, MP4, PDF up to 10MB
        </p>
      </div>

      {/* Action Buttons: Add from URL */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Attached Media ({attachments.length})
        </span>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-500 hover:text-blue-400 cursor-pointer"
        >
          <Link2 className="h-3 w-3" />
          <span>{showUrlInput ? 'Cancel URL' : '+ Add Image URL'}</span>
        </button>
      </div>

      {/* URL Attachment Input Box */}
      {showUrlInput && (
        <form
          onSubmit={handleAddUrl}
          className="p-3 rounded-xl border border-border bg-zinc-100/50 dark:bg-zinc-800/40 space-y-2 animate-in fade-in-50"
        >
          <input
            type="url"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="Paste image or media link (e.g. https://...)"
            autoFocus
            className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            style={{ outline: 'none' }}
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={mediaName}
              onChange={(e) => setMediaName(e.target.value)}
              placeholder="Media title (optional)"
              className="flex-1 bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              style={{ outline: 'none' }}
            />
            <button
              type="submit"
              disabled={!mediaUrl.trim()}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold text-xs disabled:opacity-40"
            >
              Attach
            </button>
          </div>
        </form>
      )}

      {/* Media Grid */}
      {attachments.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground text-xs">
          No media attached yet. Upload screenshots or reference images.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {attachments.map((item) => {
            const hasImage = isImage(item.type, item.url);

            return (
              <div
                key={item.id}
                className="group relative rounded-xl border border-border/80 bg-zinc-100/60 dark:bg-zinc-900/60 overflow-hidden flex flex-col justify-between shadow-2xs hover:border-zinc-400 dark:hover:border-zinc-700 transition-all"
              >
                {/* Media Preview Area */}
                {hasImage ? (
                  <div
                    onClick={() => setPreviewImage(item.url)}
                    className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    {item.type.includes('video') ? (
                      <Film className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      <File className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                )}

                {/* Footer details & Delete */}
                <div className="p-2 flex items-center justify-between gap-1 border-t border-border/50">
                  <div className="min-w-0 truncate">
                    <p className="text-[11px] font-medium text-foreground truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground">{item.size}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      title="Open full media"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1 rounded-md text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                      title="Delete media"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-70 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in-50"
        >
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-zinc-800 text-white hover:bg-zinc-700"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={previewImage}
              alt="Media preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-zinc-800"
            />
          </div>
        </div>
      )}
    </div>
  );
}
