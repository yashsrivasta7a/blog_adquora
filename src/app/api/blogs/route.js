import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/blog";
import { auth } from "@clerk/nextjs/server";
import { getClerkUser } from "@/lib/clerk";
import next from "next";

export async function GET() {
  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(blogs);
}

export async function POST(req) {
  const { userId } = auth();
  if (!userId)
    return next(
      NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    );
  const body = await req.json();
  const { title, content, slug } = body;
  if (!title || !content || !slug) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await connectDB();
  const ex = await Blog.findOne({ slug });
  if (ex)
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  const clerkUser = await getClerkUser(userId);
  const authorName = clerkUser?.first_name
    ? `${clerkUser.first_name}${
        clerkUser.last_name ? " " + clerkUser.last_name : ""
      }`
    : clerkUser?.primary_email_address?.email_address || "Unknown";

  const b = await Blog.create({
    title,
    content,
    slug,
    authorId: userId,
    authorName,
  });

  return NextResponse.json(b, { status: 201 });
}
