import { Router } from 'express';
import Post from '../models/Post.js';
import SavedView from '../models/SavedView.js';
import { getNextId, getAllTags, priorityValue } from '../util/util.js';

const router = Router();

// ---- Helper: build date query for auto-list views ----

function buildAutoListQuery(view, now) {
  if (view === 'today') {
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    return { $gte: now, $lte: endOfDay };
  }
  if (view === 'upcoming') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return { $gte: tomorrow, $lte: nextWeek };
  }
  if (view === 'overdue') {
    return { $lt: now };
  }
  return null;
}

// ---- Helper: build full Mongo query from request params ----

function buildQuery({ view, tag, priority, dateFrom, dateTo, search }) {
  const query = {};
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Auto-list date constraint
  const autoDate = buildAutoListQuery(view, now);
  if (autoDate) {
    query.date = autoDate;
    if (view === 'overdue') query.completed = { $ne: true };
  }

  // Filters
  if (tag) query.tags = tag;
  if (priority) query.priority = priority;
  if (dateFrom || dateTo) {
    if (!query.date) query.date = {};
    if (dateFrom) query.date.$gte = new Date(dateFrom);
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      query.date.$lte = to;
    }
  }
  if (search) query.title = { $regex: search, $options: 'i' };

  return query;
}

// ---- Helper: fetch and sort posts ----

async function fetchSortedPosts(query, sortBy, sortOrder) {
  const VALID_SORT_FIELDS = ['date', 'title', 'priority'];
  const sBy = VALID_SORT_FIELDS.includes(sortBy) ? sortBy : 'date';
  const sOrder = sortOrder === 'desc' ? -1 : 1;

  if (sBy === 'priority') {
    const posts = await Post.find(query);
    posts.sort((a, b) => {
      const diff = (priorityValue(a.priority) - priorityValue(b.priority)) * sOrder;
      return diff !== 0 ? diff : (new Date(a.date) - new Date(b.date));
    });
    return { posts, sBy, sOrder };
  }

  const posts = await Post.find(query).sort({ [sBy]: sOrder });
  return { posts, sBy, sOrder };
}

// GET /list - Task list with smart filters, sorting, search, auto-lists
router.get('/', async (req, res) => {
  try {
    const { view, tag, priority, dateFrom, dateTo, search, sortBy, sortOrder } = req.query;
    const activeView = view || 'all';
    const query = buildQuery({ view, tag, priority, dateFrom, dateTo, search });
    const { posts, sBy } = await fetchSortedPosts(query, sortBy, sortOrder);

    const [allTags, savedViews] = await Promise.all([
      getAllTags(),
      SavedView.find({}).sort({ pinned: -1, name: 1 }),
    ]);

    res.render('list.ejs', {
      posts,
      activeView,
      filters: {
        tag: tag || '',
        priority: priority || '',
        dateFrom: dateFrom || '',
        dateTo: dateTo || '',
        search: search || '',
      },
      sortBy: sBy,
      sortOrder: sortOrder || 'asc',
      allTags,
      savedViews,
    });
  } catch (e) {
    console.error('Error fetching posts:', e);
    res.status(500).send('Error fetching posts');
  }
});

// ---- Saved Views CRUD ----

// POST /list/views/save
router.post('/views/save', async (req, res) => {
  try {
    const newView = new SavedView({
      _id: await getNextId(),
      name: req.body.viewName,
      filters: {
        tag: req.body.tag || '',
        priority: req.body.priority || '',
        dateFrom: req.body.dateFrom || '',
        dateTo: req.body.dateTo || '',
        search: req.body.search || '',
      },
      sortBy: req.body.sortBy || 'date',
      sortOrder: req.body.sortOrder || 'asc',
      pinned: false,
    });
    await newView.save();
    res.redirect('/list');
  } catch (e) {
    console.error('Error saving view:', e);
    res.status(500).send('Error saving view');
  }
});

// GET /list/views/:id/load
router.get('/views/:id/load', async (req, res) => {
  try {
    const view = await SavedView.findById(parseInt(req.params.id));
    if (!view) return res.status(404).send('View not found');

    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(view.filters.toObject())) {
      if (val) params.set(key, val);
    }
    if (view.sortBy) params.set('sortBy', view.sortBy);
    if (view.sortOrder) params.set('sortOrder', view.sortOrder);

    res.redirect('/list?' + params.toString());
  } catch (e) {
    console.error('Error loading view:', e);
    res.status(500).send('Error loading view');
  }
});

// POST /list/views/:id/pin
router.post('/views/:id/pin', async (req, res) => {
  try {
    await SavedView.findByIdAndUpdate(parseInt(req.params.id), { pinned: true });
    res.redirect('/list');
  } catch (e) {
    console.error('Error pinning view:', e);
    res.status(500).send('Error pinning view');
  }
});

// POST /list/views/:id/unpin
router.post('/views/:id/unpin', async (req, res) => {
  try {
    await SavedView.findByIdAndUpdate(parseInt(req.params.id), { pinned: false });
    res.redirect('/list');
  } catch (e) {
    console.error('Error unpinning view:', e);
    res.status(500).send('Error unpinning view');
  }
});

// DELETE /list/views/:id/delete
router.delete('/views/:id/delete', async (req, res) => {
  try {
    await SavedView.findByIdAndDelete(parseInt(req.params.id));
    res.redirect('/list');
  } catch (e) {
    console.error('Error deleting view:', e);
    res.status(500).send('Error deleting view');
  }
});

export default router;
