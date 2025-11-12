import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Blog from "../../../models/blog";
import { auth } from "@clerk/nextjs/server";
import { getClerkUser } from "../../../lib/clerk";

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(blogs);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
  const authResult = await auth();
  const { userId } = authResult || {};
    // Helpful server-side log for debugging auth issues
    const cookieHeader = req.headers?.get ? req.headers.get("cookie") : null;
    console.log("[POST /api/blogs] auth result:", authResult, "cookieHeader:", !!cookieHeader);
    if (!userId) {
      console.warn("Unauthorized attempt to create blog - no userId in auth()");
      return NextResponse.json({ message: "Unauthorized - no session. Make sure you are signed in and cookies are present." }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, slug } = body;
    if (!title || !content || !slug) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();
    const ex = await Blog.findOne({ slug });
    if (ex) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

    const clerkUser = await getClerkUser(userId);
    const authorName = clerkUser?.first_name
      ? `${clerkUser.first_name}${clerkUser.last_name ? " " + clerkUser.last_name : ""}`
      : clerkUser?.primary_email_address?.email_address || "Unknown";

    const b = await Blog.create({ title, content, slug, authorId: userId, authorName });

    return NextResponse.json(b, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
