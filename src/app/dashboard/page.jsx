"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data) => {
        const my = Array.isArray(data) ? data.filter(b => b.authorId === user.id) : [];
        setBlogs(my);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="mb-4">You need to sign in to view your dashboard.</p>
        <Link href="/sign-in" className="px-4 py-2 bg-foreground text-background rounded">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="mb-6">Signed in as <strong>{user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || user.username || user.id}</strong></p>

      <div className="mb-6">
        <Link href="/blog/new" className="px-4 py-2 bg-blue-600 text-white rounded">Write new blog</Link>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your posts</h2>
      {blogs.length === 0 ? (
        <p className="text-zinc-500">You have not written any posts yet.</p>
      ) : (
        <div className="space-y-3">
          {blogs.map(b => (
            <div key={b._id} className="p-4 border rounded">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{b.title}</h3>
                <Link href={`/blog/${b.slug}`} className="text-sm text-blue-600">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
