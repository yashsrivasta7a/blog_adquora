const CLERK_API_BASE = "https://api.clerk.com/v1";

//Uses your Clerk secret key from .env
function clerkHeaders() {
  const key = process.env.CLERK_API_KEY || process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET;
  if (!key) throw new Error("CLERK API key missing in env (set CLERK_API_KEY or CLERK_SECRET_KEY)");
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json"
  };
}

//Fetches a single user’s data directly from Clerk’s REST API
export async function getClerkUser(userId) {
  if (!userId) return null;
  const res = await fetch(`${CLERK_API_BASE}/users/${userId}`, {
    headers: clerkHeaders()
  });
  if (!res.ok) return null;
  return await res.json();
}

//Used for listing multiple users, like in an admin dashboard.
export async function listClerkUsers({ limit = 100, offset = 0 } = {}) {
  const res = await fetch(`${CLERK_API_BASE}/users?limit=${limit}&offset=${offset}`, {
    headers: clerkHeaders()
  });
  if (!res.ok) throw new Error("Failed to fetch users from Clerk");
  return await res.json();
}

//Makes a PATCH request to update a user’s public metadata (role, etc.).
export async function updateClerkUserPublicMetadata(userId, public_metadata) {
  const res = await fetch(`${CLERK_API_BASE}/users/${userId}`, {
    method: "PATCH",
    headers: clerkHeaders(),
    body: JSON.stringify({ public_metadata })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Clerk update failed: ${res.status} ${txt}`);
  }
  return await res.json();
}
