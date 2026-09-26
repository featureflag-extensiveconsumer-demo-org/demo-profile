import test from 'node:test';
import assert from 'node:assert/strict';
import { renderPreferences } from '../src/preferences/preferences.mjs';

const context = { user: { key: 'customer-2093' } };
const stubClient = (value, calls) => ({
  boolVariation: async (key, evaluated, fallback) => { calls.push({ key, fallback }); return value; }
});

test('one consolidated panel is served when the flag is on', async () => {
  const calls = [];
  const { consolidated, panels } = await renderPreferences(stubClient(true, calls), context);
  assert.equal(consolidated, true);
  assert.deepEqual(panels, ['preferences']);
});

test('the two original panels are served when the flag is off', async () => {
  const calls = [];
  const { consolidated, panels } = await renderPreferences(stubClient(false, calls), context);
  assert.equal(consolidated, false);
  assert.deepEqual(panels, ['notifications', 'privacy']);
});

test('preferences asks LaunchDarkly exactly once, with the compiled fallback', async () => {
  const calls = [];
  await renderPreferences(stubClient(false, calls), context);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].key, 'demo-profile-preferences');
  assert.equal(calls[0].fallback, false);
});
