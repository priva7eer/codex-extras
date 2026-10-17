"use strict";

const PRIORITY = { waiting: 0, question: 0, working: 1, completed: 2 };

function sortSessions(sessions, order) {
  if (order !== "activeFirst") return sessions;
  return [...sessions].sort((left, right) => {
    const priority = (PRIORITY[left.status] ?? 3) - (PRIORITY[right.status] ?? 3);
    const activity = (session) => Math.max(
      session.activityAt ?? 0,
      session.updatedAt ? Date.parse(session.updatedAt) || 0 : 0,
    );
    return priority || activity(right) - activity(left) || left.title.localeCompare(right.title) || left.id.localeCompare(right.id);
  });
}

module.exports = { sortSessions };
