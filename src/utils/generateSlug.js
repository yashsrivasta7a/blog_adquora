export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\u0000-\u007F]+/g, "")  
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
