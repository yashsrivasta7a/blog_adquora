"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CommentForm from "../../../components/CommentForm";
import CommentList from "../../../components/CommentList";

export default function BlogDetail({ params }) {
  const { slug } = params;
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    fetch('/api/blogs')
      .then(r=>r.json())
      .then(list=>{
        const found = Array.isArray(list) ? list.find(b=>b.slug===slug) : null;
        if (!found) {
          if (mounted) setLoading(false);
          return;
        }
        if (mounted) setBlog(found);
        return fetch(`/api/blogs/${found._id}/comments`).then(r=>r.json()).catch(()=>[]);
      })
      .then(coms=>{ if (mounted && coms) setComments(coms); })
      .catch(()=>{})
      .finally(()=>{ if (mounted) setLoading(false); });
    return ()=> mounted = false;
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center">Blog not found</div>;

  return (
    <article className="min-h-screen max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <div className="text-zinc-500 mb-6">By {blog.authorName} • {new Date(blog.createdAt).toLocaleDateString()}</div>
      <div className="prose dark:prose-invert mb-8">
        {String(blog.content || "").split(/\n{2,}/).map((para, pidx) => (
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

      <section>
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <CommentForm id={blog._id} onCommentAdded={(c)=> setComments(prev=>[c,...prev])} />
        <div className="mt-6">
          <CommentList id={blog._id} initialComments={comments} />
        </div>
      </section>
    </article>
  );
}
