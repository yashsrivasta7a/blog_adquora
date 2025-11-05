// app/api/users/route.js
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { listClerkUsers, getClerkUser } from "@/lib/clerk";

export async function GET(req) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const caller = await getClerkUser(userId);
  const role = caller?.public_metadata?.role || "reader";
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") || 100);
  const offset = Number(url.searchParams.get("offset") || 0);

  const users = await listClerkUsers({ limit, offset });
  // Return a lighter shape (id, email, role, name)
  const mapped = users.map((u) => ({
    id: u.id,
    email: u.primary_email_address?.email_address || u.email_addresses?.[0]?.email_address || null,
    role: u.public_metadata?.role || "reader",
    firstName: u.first_name,
    lastName: u.last_name
  }));

  return NextResponse.json(mapped);
}
