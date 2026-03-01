import Counter from '../models/Counter.js';
import Post from '../models/Post.js';

// Get the next auto-incremented ID
export async function getNextId() {
  const result = await Counter.findByIdAndUpdate(
    'postId',
    { $inc: { seq: 1 } },
    { 
      new: true,
      upsert: true,
    }
  );
  return result.seq;
}

// Collect all unique tags across posts
export async function getAllTags() {
  const posts = await Post.find({}, { tags: 1 });
  const tagSet = new Set();
  posts.forEach(p => {
    if (p.tags) p.tags.forEach(t => tagSet.add(t));
  });
  return Array.from(tagSet).sort();
}

// Map priority to numeric value for sorting (high=1, medium=2, low=3)
const PRIORITY_ORDER = { high: 1, medium: 2, low: 3 };
export function priorityValue(p) {
  return PRIORITY_ORDER[p] || 2;
}

// Parse comma-separated tags string into a trimmed, non-empty array
export function parseTags(tagsString) {
  if (!tagsString) return [];
  return tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0);
}
