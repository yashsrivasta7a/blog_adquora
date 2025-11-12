"use client";

import { useState } from "react";

export default function CommentList({ id, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments || []);

  // Simple refresh helper in case parent wants to refetch
  async function refresh() {
    try {
      const res = await fetch(`/api/blogs/${id}/comments`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      {comments.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c._id} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded">
              <div className="text-sm text-zinc-500 mb-1">{c.authorName} • {new Date(c.createdAt).toLocaleString()}</div>
              <div className="text-foreground">
                {String(c.content || "").split(/\n{2,}/).map((para, pidx) => (
                  <p key={pidx}>
                    {para.split(/\n/).map((line, lidx) => (
                      <span key={lidx}>
                        {line}
                        {lidx < para.split(/\n/).length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <button onClick={refresh} className="text-sm text-blue-600 dark:text-blue-400">Refresh comments</button>
      </div>
    </div>
  );
}
