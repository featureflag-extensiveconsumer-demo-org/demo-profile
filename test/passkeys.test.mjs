import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSignIn } from '../src/identity/passkeys.mjs';

const context = { user: { key: 'customer-4410' } };
const stubClient = (value, calls) => ({
  boolVariation: async (key, evaluated, fallback) => { calls.push({ key, fallback }); return value; }
});

test('the passkey challenge is offered alongside the password form when the flag is on', async () => {
  const calls = [];
  const { passkeyOffered, methods } = await renderSignIn(stubClient(true, calls), context);
  assert.equal(passkeyOffered, true);
  assert.deepEqual(methods, ['passkey', 'password']);
});

test('the password form stands alone when the flag is off', async () => {
  const calls = [];
  const { passkeyOffered, methods } = await renderSignIn(stubClient(false, calls), context);
  assert.equal(passkeyOffered, false);
  assert.deepEqual(methods, ['password']);
});

test('sign-in asks LaunchDarkly exactly once, with the compiled fallback', async () => {
  const calls = [];
  await renderSignIn(stubClient(true, calls), context);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].key, 'demo-identity-passkeys');
  assert.equal(calls[0].fallback, false);
});
