import assert from 'node:assert';
import test from 'node:test';
import http from 'http';
import { createApp } from '../app';
import { Server as SocketIOServer } from 'socket.io';
import { initSocketServer } from '../socket';
import { authService } from '../services/authService';

test('Doubts API & Realtime - Student Submits Hinglish Doubt Anonymously', async () => {
  const app = createApp();
  const server = http.createServer(app);
  const io = new SocketIOServer(server);
  initSocketServer(io);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;

  // 1. Get student session (Krishan Awasthi)
  const studentSession = authService.demoLogin('STUDENT', 'krishan');

  // 2. Submit doubt
  const res = await fetch(`http://127.0.0.1:${port}/api/doubts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentSession.token}`,
    },
    body: JSON.stringify({
      subjectCode: 'OOP',
      text: 'Sir mujhe overriding aur overloading me difference samajh nahi aa raha.',
      category: 'CONCEPT',
      isWholeClass: true,
    }),
  });

  assert.strictEqual(res.status, 201);
  const json = (await res.json()) as {
    success: boolean;
    data: {
      referenceNo: string;
      doubt: { referenceNo: string; text: string; askedBy: string; internalUserId?: string };
    };
  };

  assert.strictEqual(json.success, true);
  assert.ok(json.data.referenceNo.startsWith('#Q-'), 'Reference code must start with #Q-');
  assert.strictEqual(json.data.doubt.askedBy, 'Anonymous Student');
  assert.strictEqual(json.data.doubt.internalUserId, undefined, 'Student ID must NOT be exposed');

  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('Doubts API - Rate Limiting Cooldown on Rapid Submission', async () => {
  const app = createApp();
  const server = http.createServer(app);
  const io = new SocketIOServer(server);
  initSocketServer(io);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;

  const studentSession = authService.demoLogin('STUDENT', 'B3');

  // First submission
  const res1 = await fetch(`http://127.0.0.1:${port}/api/doubts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentSession.token}`,
    },
    body: JSON.stringify({
      subjectCode: 'OOP',
      text: 'First question about memory allocation in heap.',
      category: 'CONCEPT',
    }),
  });
  assert.strictEqual(res1.status, 201);

  // Immediate second submission
  const res2 = await fetch(`http://127.0.0.1:${port}/api/doubts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentSession.token}`,
    },
    body: JSON.stringify({
      subjectCode: 'OOP',
      text: 'Second question immediately submitted.',
      category: 'CONCEPT',
    }),
  });
  assert.strictEqual(res2.status, 400);
  const json2 = (await res2.json()) as { success: boolean; error: { message: string } };
  assert.ok(json2.error.message.includes('Cooldown active'));

  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('Teacher API - Faculty Views Live Doubts & Clusters', async () => {
  const app = createApp();
  const server = http.createServer(app);
  const io = new SocketIOServer(server);
  initSocketServer(io);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;

  const teacherSession = authService.demoLogin('TEACHER', 'US');

  const res = await fetch(`http://127.0.0.1:${port}/api/teacher/live-doubts?subjectCode=OOP`, {
    headers: { Authorization: `Bearer ${teacherSession.token}` },
  });

  assert.strictEqual(res.status, 200);
  const json = (await res.json()) as {
    success: boolean;
    data: {
      doubts: Array<{ askedBy: string; internalUserId?: string }>;
      commonTopicGroups: Array<{ topicTitle: string; studentCount: number }>;
      metrics: { total: number; unanswered: number };
    };
  };

  assert.strictEqual(json.success, true);
  assert.ok(json.data.doubts.length > 0);
  assert.strictEqual(json.data.doubts[0].askedBy, 'Anonymous Student');
  assert.strictEqual(json.data.doubts[0].internalUserId, undefined);
  assert.ok(json.data.commonTopicGroups.length > 0, 'Must detect common topic clusters');

  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('Teacher API - Faculty Answers and Publishes Doubt to Class', async () => {
  const app = createApp();
  const server = http.createServer(app);
  const io = new SocketIOServer(server);
  initSocketServer(io);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;

  const teacherSession = authService.demoLogin('TEACHER', 'US');

  // Answer pre-existing doubt dbt-1042
  const res = await fetch(`http://127.0.0.1:${port}/api/teacher/doubts/dbt-1042/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${teacherSession.token}`,
    },
    body: JSON.stringify({
      answerText: 'Overloading happens within the same class at compile time with different parameters. Overriding happens in sub-classes at runtime.',
      isPublishedToClass: true,
      isSavedAsFaq: true,
    }),
  });

  assert.strictEqual(res.status, 200);
  const json = (await res.json()) as {
    success: boolean;
    data: { doubt: { status: string }; response: { answerText: string; isPublishedToClass: boolean } };
  };

  assert.strictEqual(json.success, true);
  assert.strictEqual(json.data.doubt.status, 'PUBLISHED');
  assert.strictEqual(json.data.response.isPublishedToClass, true);

  // Verify it appears in Common Doubts
  const commonRes = await fetch(`http://127.0.0.1:${port}/api/doubts/common?subjectCode=OOP`);
  const commonJson = (await commonRes.json()) as { data: Array<{ id: string }> };
  assert.ok(commonJson.data.some((d) => d.id === 'dbt-1042'), 'Answered doubt must appear in common doubts');

  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('Doubts API - Class Pulse & Upvoting', async () => {
  const app = createApp();
  const server = http.createServer(app);
  const io = new SocketIOServer(server);
  initSocketServer(io);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;

  const studentSession = authService.demoLogin('STUDENT', 'krishan');

  // 1. Upvote
  const upvoteRes = await fetch(`http://127.0.0.1:${port}/api/doubts/dbt-1038/upvote`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentSession.token}` },
  });
  assert.strictEqual(upvoteRes.status, 200);
  const upvoteData = (await upvoteRes.json()) as { data: { upvotes: number } };
  assert.ok(upvoteData.data.upvotes > 0);

  // 2. Class Pulse
  const pulseRes = await fetch(`http://127.0.0.1:${port}/api/doubts/pulse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentSession.token}`,
    },
    body: JSON.stringify({
      classSessionId: 'sess-today',
      rating: 'FULLY',
      subjectCode: 'OOP',
    }),
  });
  assert.strictEqual(pulseRes.status, 200);
  const pulseData = (await pulseRes.json()) as { data: { total: number; fullyPct: number } };
  assert.ok(pulseData.data.total > 0);

  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('Teacher API - Room Change Broadcast & Analytics Insights', async () => {
  const app = createApp();
  const server = http.createServer(app);
  const io = new SocketIOServer(server);
  initSocketServer(io);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;

  const teacherSession = authService.demoLogin('TEACHER', 'US');

  // 1. Room change
  const roomRes = await fetch(`http://127.0.0.1:${port}/api/teacher/room-change`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${teacherSession.token}`,
    },
    body: JSON.stringify({
      subjectCode: 'OOP',
      oldRoom: 'ATC-301',
      newRoom: 'ATC-305',
    }),
  });
  assert.strictEqual(roomRes.status, 200);

  // 2. Insights
  const insightsRes = await fetch(`http://127.0.0.1:${port}/api/teacher/insights?subjectCode=OOP`, {
    headers: { Authorization: `Bearer ${teacherSession.token}` },
  });
  assert.strictEqual(insightsRes.status, 200);
  const insightsData = (await insightsRes.json()) as { data: { totalDoubts: number; mostDiscussedTopics: unknown[] } };
  assert.ok(insightsData.data.totalDoubts > 0);
  assert.ok(insightsData.data.mostDiscussedTopics.length > 0);

  await new Promise<void>((resolve) => server.close(() => resolve()));
});
