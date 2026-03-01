// Mock calendar tasks for local development. This file is intentionally
// a client-side JS file that sets `window.CALENDAR_TASKS` so it can be
// swapped out later with a fetch to a real API without touching server code.
// Each task: { id, startDate (ISO YYYY-MM-DD), endDate (ISO or null), name, priority (1-3), link }

window.CALENDAR_TASKS = [
  { id: 1, startDate: '2026-02-02', endDate: null, name: 'Read Chapter 3', priority: 2, link: null },
  { id: 2, startDate: '2026-02-05', endDate: '2026-02-07', name: 'Group Project Work', priority: 3, link: null },
  { id: 3, startDate: '2026-02-14', endDate: null, name: 'Valentine Reminder', priority: 1, link: null },
  { id: 4, startDate: '2026-01-30', endDate: null, name: 'Finish Lab', priority: 2, link: null },
  { id: 5, startDate: '2026-02-28', endDate: '2026-03-02', name: 'Sprint Demo', priority: 3, link: null },
  { id: 6, startDate: '2026-03-03', endDate: null, name: 'Start Assignment', priority: 2, link: null },
  { id: 7, startDate: '2026-02-05', endDate: null, name: 'Meeting w/ TA', priority: 1, link: null },
  { id: 8, startDate: '2026-02-05', endDate: null, name: 'Submit Draft', priority: 2, link: null },
  { id: 9, startDate: '2026-03-01', endDate: null, name: 'New Month Prep', priority: 1, link: null }
];
