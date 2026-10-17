"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { sortSessions } = require("../session-sort");
const chat = (id, status, activityAt = 0) => ({ id, title: id, status, activityAt });

test("active-first prioritizes attention, working agents, unread results, and other chats", () => {
  const input = [chat("idle", "idle", 100), chat("result", "completed", 80), chat("work", "working", 60),
    chat("question", "question", 40), chat("approval", "waiting", 50), chat("reviewed", "reviewed", 90)];
  const original = [...input];
  assert.deepEqual(sortSessions(input, "activeFirst").map((session) => session.id),
    ["approval", "question", "work", "result", "idle", "reviewed"]);
  assert.deepEqual(input, original, "sorting must not mutate the source list");
});

test("activity timestamps order peers with index-date and deterministic title fallbacks", () => {
  const input = [chat("B", "reviewed"), chat("A", "idle"), chat("opened", "reviewed", 300),
    { ...chat("indexed", "idle"), updatedAt: "2026-01-01T00:00:00Z" }];
  assert.deepEqual(sortSessions(input, "activeFirst").map((session) => session.id), ["indexed", "opened", "A", "B"]);
  assert.equal(sortSessions(input, "recent"), input, "recent mode preserves existing index ordering");
  assert.equal(sortSessions(input, "unsupported"), input);
});
