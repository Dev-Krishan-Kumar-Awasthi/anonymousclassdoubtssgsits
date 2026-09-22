import assert from 'node:assert';
import test from 'node:test';
import { createApp } from '../app';
import http from 'http';

test('Health endpoint returns healthy status and Asia/Kolkata timezone', async () => {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  const address = server.address();
  assert(address && typeof address === 'object', 'Server address is invalid');
  const port = address.port;

  const res = await fetch(`http://127.0.0.1:${port}/api/health`);
  assert.strictEqual(res.status, 200);

  const data = await res.json() as {
    status: string;
    timezone: string;
    istTimestamp: string;
    service: string;
  };

  assert.strictEqual(data.status, 'healthy');
  assert.strictEqual(data.timezone, 'Asia/Kolkata');
  assert.strictEqual(data.service, 'SGSITS Anonymous Backend API');
  assert.ok(data.istTimestamp.length > 0);

  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});
