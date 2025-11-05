import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/blog";
import { auth } from "@clerk/nextjs/server";
import { getClerkUser } from "@/lib/clerk";
import next from "next";

export async function GET(req, { params }) {
  const { id } = params;
  await connectDB();
  const blog = await Blog.findById(id).lean();
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(blog);
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await connectDB();

  const blog = await Blog.findById(id);
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const caller = await getClerkUser(userId);
  const role = caller?.public_metadata?.role || "reader";

  if (blog.authorId !== userId && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  blog.title = body.title ?? blog.title;
  blog.content = body.content ?? blog.content;
  if (body.slug && body.slug !== blog.slug) {
    // check unique slug if changing
    const existing = await Blog.findOne({ slug: body.slug });
    if (existing && String(existing._id) !== String(blog._id)) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }
    blog.slug = body.slug;
  }
  await blog.save();
  return NextResponse.json(blog);
}
export async function DELETE(req, { params }) {
  const { id } = params;
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const blog = await Blog.findById(id);
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const caller = await getClerkUser(userId);
  const role = caller?.public_metadata?.role || "reader";

  if (blog.authorId !== userId && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await blog.remove();
  return NextResponse.json({ message: "Deleted" });
}
