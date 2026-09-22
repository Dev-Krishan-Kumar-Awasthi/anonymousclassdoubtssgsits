import assert from 'node:assert';
import test from 'node:test';
import { createApp } from '../app';
import { authenticateToken, requireRole, requireTeacherScope } from '../middleware/auth';
import http from 'http';

test('Auth API - Valid Student Login returns JWT and Profile', async () => {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;

  const res = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'krishan.awasthi@sgsits.ac.in',
      password: 'password123',
    }),
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json() as {
    success: boolean;
    data: {
      token: string;
      user: { role: string; email: string };
      profile: { fullName: string; batch: string };
    };
  };

  assert.strictEqual(body.success, true);
  assert.ok(body.data.token, 'Token must be present');
  assert.strictEqual(body.data.user.role, 'STUDENT');
  assert.strictEqual(body.data.profile.fullName, 'Krishan Awasthi');
  assert.strictEqual(body.data.profile.batch, 'B2');

  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('Auth API - Invalid Password returns 401', async () => {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;

  const res = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'krishan.awasthi@sgsits.ac.in',
      password: 'wrongpassword',
    }),
  });

  assert.strictEqual(res.status, 401);
  const body = await res.json() as { success: boolean; error: { message: string } };
  assert.strictEqual(body.success, false);

  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('Auth API - 1-Click Demo Login for Student, Teacher, and Admin', async () => {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;

  // 1. Student Demo Login
  const studentRes = await fetch(`http://127.0.0.1:${port}/api/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'STUDENT', identifier: 'krishan' }),
  });
  assert.strictEqual(studentRes.status, 200);
  const studentData = (await studentRes.json()) as { data: { user: { role: string }; token: string } };
  assert.strictEqual(studentData.data.user.role, 'STUDENT');

  // 2. Teacher Demo Login
  const teacherRes = await fetch(`http://127.0.0.1:${port}/api/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'TEACHER', identifier: 'US' }),
  });
  assert.strictEqual(teacherRes.status, 200);
  const teacherData = (await teacherRes.json()) as { data: { user: { role: string }; token: string } };
  assert.strictEqual(teacherData.data.user.role, 'TEACHER');

  // 3. Admin Demo Login
  const adminRes = await fetch(`http://127.0.0.1:${port}/api/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'ADMIN' }),
  });
  assert.strictEqual(adminRes.status, 200);
  const adminData = (await adminRes.json()) as { data: { user: { role: string } } };
  assert.strictEqual(adminData.data.user.role, 'ADMIN');

  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('Auth RBAC - Student Cannot Access Teacher Route (403 Forbidden)', async () => {
  const app = createApp();
  // Register a test protected route
  app.get('/api/test/teacher-only', authenticateToken, requireRole(['TEACHER']), (req, res) => {
    res.json({ success: true, message: 'Teacher secret portal' });
  });

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;

  // 1. Get student token
  const loginRes = await fetch(`http://127.0.0.1:${port}/api/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'STUDENT' }),
  });
  const { data } = (await loginRes.json()) as { data: { token: string } };

  // 2. Attempt to call teacher route with student token
  const deniedRes = await fetch(`http://127.0.0.1:${port}/api/test/teacher-only`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
  assert.strictEqual(deniedRes.status, 403, 'Student must be denied access to teacher route');

  // 3. Attempt to call without token -> 401
  const unauthRes = await fetch(`http://127.0.0.1:${port}/api/test/teacher-only`);
  assert.strictEqual(unauthRes.status, 401, 'Unauthenticated must be 401');

  await new Promise<void>((resolve) => server.close(() => resolve()));
});

test('Auth Privacy - Teacher Cannot Access Another Teacher Private Scope', async () => {
  const app = createApp();
  app.get(
    '/api/test/teacher-scope/:teacherCode',
    authenticateToken,
    requireTeacherScope,
    (req, res) => {
      res.json({ success: true, message: 'Scope authorized' });
    }
  );

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;

  // 1. Login as Teacher US
  const loginRes = await fetch(`http://127.0.0.1:${port}/api/auth/demo-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'TEACHER', identifier: 'US' }),
  });
  const { data } = (await loginRes.json()) as { data: { token: string } };

  // 2. Access own scope (US) -> 200 OK
  const ownRes = await fetch(`http://127.0.0.1:${port}/api/test/teacher-scope/US`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
  assert.strictEqual(ownRes.status, 200);

  // 3. Access another teacher scope (LP) -> 403 Forbidden
  const otherRes = await fetch(`http://127.0.0.1:${port}/api/test/teacher-scope/LP`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
  assert.strictEqual(otherRes.status, 403, 'Teacher US must not access LP data');

  await new Promise<void>((resolve) => server.close(() => resolve()));
});
