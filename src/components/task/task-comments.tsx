'use client';

import React, { useState } from 'react';
import { Comment } from '@/types';
import { useTaskStore } from '@/stores/task-store';
import { Avatar } from '@/components/ui/avatar';
import { MOCK_USERS } from '@/services/mock-data';
import { MessageSquare, Send, CornerDownLeft } from 'lucide-react';
import { formatFullDate } from '@/lib/utils';
import { toast } from 'sonner';

interface TaskCommentsProps {
  taskId: string;
  comments: Comment[];
}

export function TaskComments({ taskId, comments }: TaskCommentsProps) {
  const [content, setContent] = useState('');
  const addComment = useTaskStore((state) => state.addComment);

  const currentUser = MOCK_USERS[3]; // Siddharth Rao (Principal Frontend Engineer)

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    addComment(taskId, content.trim(), currentUser.id);
    setContent('');
    toast.success('Comment posted');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Discussion ({comments.length})
        </h4>
      </div>

      {/* Comments thread */}
      <div className="space-y-3">
        {comments.map((comment) => {
          const user = MOCK_USERS.find((u) => u.id === comment.authorId);

          return (
            <div
              key={comment.id}
              className="flex gap-3 rounded-xl border border-border/50 bg-zinc-50/50 dark:bg-zinc-900/30 p-3"
            >
              <Avatar user={user} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-foreground">
                    {comment.authorName}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {formatFullDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          );
        })}

        {comments.length === 0 && (
          <p className="text-xs text-muted-foreground py-2 italic">
            No comments yet. Start the conversation below.
          </p>
        )}
      </div>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="space-y-2 pt-2">
        <div className="flex gap-2.5">
          <Avatar user={currentUser} size="sm" />
          <div className="flex-1 relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Leave a comment... (Enter to send, Shift+Enter for new line)"
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-zinc-400 leading-relaxed"
            />
            <div className="flex items-center justify-end mt-1.5">
              <button
                type="submit"
                disabled={!content.trim()}
                className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1.5 text-xs font-medium hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
              >
                <span>Comment</span>
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
