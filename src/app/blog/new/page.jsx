"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { generateSlug } from "../../../utils/generateSlug";

export default function NewBlogPage() {
  const { user } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function onTitleChange(e) {
    const t = e.target.value;
    setTitle(t);
    setSlug(generateSlug(t));
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (!user) return setError("You must be signed in to create a post.");
    if (!title.trim() || !content.trim() || !slug.trim())
      return setError("Please fill title, content and slug.");

    setLoading(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create blog");
      // navigate to the new blog
      router.push(`/blog/${data.slug}`);
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">You must be signed in to create a blog post.</p>
          <Link href="/sign-in" className="px-4 py-2 bg-foreground text-background rounded">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-4">Write a new blog</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-600 dark:text-zinc-400">Title</label>
          <input value={title} onChange={onTitleChange} className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded bg-background text-foreground" />
        </div>
        <div>
          <label className="block text-sm text-zinc-600 dark:text-zinc-400">Slug</label>
          <input value={slug} onChange={(e)=>setSlug(e.target.value)} className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded bg-background text-foreground" />
        </div>
        <div>
          <label className="block text-sm text-zinc-600 dark:text-zinc-400">Content (plain text, markdown or HTML — anything you type will be saved)</label>
          <textarea value={content} onChange={(e)=>setContent(e.target.value)} rows={12} className="w-full p-3 border border-zinc-200 dark:border-zinc-800 rounded bg-background text-foreground" />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-foreground text-background rounded disabled:opacity-50">{loading?"Creating...":"Create post"}</button>
          <Link href="/dashboard" className="text-sm text-zinc-600 dark:text-zinc-400">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
