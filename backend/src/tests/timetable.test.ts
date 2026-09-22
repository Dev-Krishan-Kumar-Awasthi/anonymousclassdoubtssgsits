import assert from 'node:assert';
import test from 'node:test';
import { timetableService } from '../services/timetableService';
import { createApp } from '../app';
import http from 'http';

test('Timetable Engine - Evaluates Monday 11:30 AM IST as Live OOP Class', () => {
  // Monday Sep 28, 2026 at 11:30 AM IST (UTC: 06:00 AM)
  const monday1130IST = new Date('2026-09-28T06:00:00Z');

  const result = timetableService.getCurrentClass({
    batch: 'B2',
    simulatedTime: monday1130IST,
  });

  assert.ok(result.entry, 'Should have an active class');
  assert.strictEqual(result.entry?.subjectCode, 'OOP');
  assert.strictEqual(result.entry?.roomNumber, 'ATC-301');
  assert.deepStrictEqual(result.entry?.teacherCodes, ['US']);
  assert.strictEqual(result.statusInfo.status, 'LIVE');
  assert.strictEqual(result.statusInfo.isLive, true);
  assert.strictEqual(result.statusInfo.minutesRemaining, 30); // Ends at 12:00 PM (30 mins remaining)

  // Verify next class detected
  assert.ok(result.nextEntry, 'Should detect next class');
  assert.strictEqual(result.nextEntry?.subjectCode, 'MATH3');
  assert.strictEqual(result.nextEntry?.roomNumber, 'ATC-309');
  assert.strictEqual(result.nextEntry?.startTime, '01:00 PM');
});

test('Timetable Engine - 10-Minute Starting Soon Window (Monday 10:52 AM)', () => {
  // Monday Sep 28, 2026 at 10:52 AM IST (UTC: 05:22 AM)
  const monday1052IST = new Date('2026-09-28T05:22:00Z');

  const result = timetableService.getCurrentClass({
    batch: 'B2',
    simulatedTime: monday1052IST,
  });

  assert.ok(result.entry, 'Should detect starting soon class');
  assert.strictEqual(result.entry?.subjectCode, 'OOP');
  assert.strictEqual(result.statusInfo.status, 'STARTING_SOON');
  assert.strictEqual(result.statusInfo.isStartingSoon, true);
  assert.strictEqual(result.statusInfo.minutesUntilStart, 8); // 10:52 -> 11:00 = 8 minutes
});

test('Timetable Engine - Parallel Lab Batch Filtering (Monday 02:30 PM)', () => {
  // Monday Sep 28, 2026 at 02:30 PM IST (UTC: 09:00 AM)
  const monday1430IST = new Date('2026-09-28T09:00:00Z');

  // Batch B2 student
  const resultB2 = timetableService.getCurrentClass({
    batch: 'B2',
    simulatedTime: monday1430IST,
  });
  assert.strictEqual(resultB2.entry?.subjectCode, 'DS-LAB', 'B2 must have DS Lab');
  assert.strictEqual(resultB2.entry?.batch, 'B2');
  assert.strictEqual(resultB2.entry?.roomNumber, 'LAB105');

  // Batch B1 student
  const resultB1 = timetableService.getCurrentClass({
    batch: 'B1',
    simulatedTime: monday1430IST,
  });
  assert.strictEqual(resultB1.entry?.subjectCode, 'DSD-LAB', 'B1 must have DSD Lab');
  assert.strictEqual(resultB1.entry?.batch, 'B1');
  assert.strictEqual(resultB1.entry?.roomNumber, 'LAB105');

  // Batch B3 student
  const resultB3 = timetableService.getCurrentClass({
    batch: 'B3',
    simulatedTime: monday1430IST,
  });
  assert.strictEqual(resultB3.entry?.subjectCode, 'OOP-LAB', 'B3 must have OOP Lab');
  assert.strictEqual(resultB3.entry?.batch, 'B3');
  assert.strictEqual(resultB3.entry?.roomNumber, 'Lab207');
});

test('Timetable Engine - Teacher Current Class Matching', () => {
  // Monday Sep 28, 2026 at 02:30 PM IST
  const monday1430IST = new Date('2026-09-28T09:00:00Z');

  // Teacher US teaching OOP Lab for B3 in Lab207
  const resultUS = timetableService.getCurrentClass({
    teacherCode: 'US',
    simulatedTime: monday1430IST,
  });
  assert.strictEqual(resultUS.entry?.subjectCode, 'OOP-LAB');
  assert.strictEqual(resultUS.entry?.roomNumber, 'Lab207');
  assert.strictEqual(resultUS.statusInfo.status, 'LIVE');
});

test('Timetable Engine - Weekend Free Time (Sunday 11:00 AM)', () => {
  // Sunday Sep 27, 2026 at 11:00 AM IST (UTC: 05:30 AM)
  const sunday1100IST = new Date('2026-09-27T05:30:00Z');

  const result = timetableService.getCurrentClass({
    batch: 'B2',
    simulatedTime: sunday1100IST,
  });

  assert.strictEqual(result.entry, null, 'No class should be active on Sunday');
  assert.strictEqual(result.academicTime.dayOfWeek, 'SUNDAY');
});

test('Timetable REST API - GET /api/timetable/current-class', async () => {
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  const address = server.address();
  assert(address && typeof address === 'object');
  const port = address.port;

  // Query Monday 11:30 AM simulation
  const simParam = encodeURIComponent('2026-09-28T06:00:00Z');
  const res = await fetch(`http://127.0.0.1:${port}/api/timetable/current-class?batch=B2&simulatedTime=${simParam}`);
  assert.strictEqual(res.status, 200);

  const json = await res.json() as {
    success: boolean;
    data: {
      entry: { subjectCode: string; roomNumber: string };
      statusInfo: { status: string; isLive: boolean };
    };
  };

  assert.strictEqual(json.success, true);
  assert.strictEqual(json.data.entry.subjectCode, 'OOP');
  assert.strictEqual(json.data.entry.roomNumber, 'ATC-301');
  assert.strictEqual(json.data.statusInfo.status, 'LIVE');

  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});
