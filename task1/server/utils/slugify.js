function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uniqueSlug(Post, title, excludeId) {
  const base = slugify(title) || `post-${Date.now()}`;
  let slug = base;
  let i = 1;
  const query = { slug };
  if (excludeId) query._id = { $ne: excludeId };
  while (await Post.findOne(query)) {
    slug = `${base}-${i++}`;
    query.slug = slug;
  }
  return slug;
}

module.exports = { slugify, uniqueSlug };
