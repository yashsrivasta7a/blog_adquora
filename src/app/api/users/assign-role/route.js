
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getClerkUser, updateClerkUserPublicMetadata } from "@/lib/clerk";

export async function PATCH(req) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const caller = await getClerkUser(userId);
  const callerRole = caller?.public_metadata?.role || "reader";
  if (callerRole !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { targetUserId, role } = body;
  if (!targetUserId || !role) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const allowed = ["admin", "author", "reader"];
  if (!allowed.includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  try {
    const updated = await updateClerkUserPublicMetadata(targetUserId, { role });
    return NextResponse.json({
      id: updated.id,
      role: updated.public_metadata?.role,
      firstName: updated.first_name,
      lastName: updated.last_name
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
