"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => setBlogs(data))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">All Blogs</h1>
      <div className="space-y-4">
        {blogs.map((b) => (
          <Link key={b._id} href={`/blog/${b.slug}`} className="block p-4 border rounded hover:bg-zinc-50 dark:hover:bg-zinc-900">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{b.title}</h2>
              <small className="text-zinc-500">{new Date(b.createdAt).toLocaleDateString()}</small>
            </div>
            <p className="text-zinc-400 mt-2 line-clamp-2">{b.content.replace(/<[^>]+>/g, "").slice(0, 180)}{b.content.length>180?"...":""}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
