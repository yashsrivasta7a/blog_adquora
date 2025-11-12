"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function CommentForm({ id, onCommentAdded }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  async function submit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    if (!user) return; // user must be signed in
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      if (!res.ok) throw new Error("Failed to post comment");
      const data = await res.json();
      setContent("");
      if (onCommentAdded) onCommentAdded(data);
    } catch (err) {
      console.error(err);
      alert("Could not post comment");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">You must be signed in to comment.</p>
        <div className="mt-2">
          <Link href="/sign-in" className="px-3 py-1 bg-foreground text-background rounded">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded bg-background text-foreground"
        placeholder="Write a thoughtful comment..."
      />
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-foreground text-background rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}
