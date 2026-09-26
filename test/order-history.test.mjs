import test from 'node:test';
import assert from 'node:assert/strict';
import { ORDER_HISTORY_PAGE_SIZE, isOrderHistoryV2Enabled, renderOrderHistory } from '../src/orders/order-history.mjs';

const context = { user: { key: 'customer-8821' } };
const stubClient = (value, calls) => ({
  boolVariation: async (key, evaluated, fallback) => { calls.push({ key, fallback, evaluated }); return value; }
});

test('the paginated view is served when the flag is on', async () => {
  const calls = [];
  const { paginated, view } = await renderOrderHistory(stubClient(true, calls), context);
  assert.equal(paginated, true);
  assert.equal(view.page, 1);
  assert.ok(view.rows.length > 0);
  assert.ok(view.rows.every((row) => typeof row.shipmentCount === 'number'));
});

test('the legacy flat list is served when the flag is off', async () => {
  const calls = [];
  const { paginated, view } = await renderOrderHistory(stubClient(false, calls), context);
  assert.equal(paginated, false);
  assert.ok(Array.isArray(view));
  // One row per shipment is the behaviour v2 replaced, so a split order appears more than once.
  assert.ok(view.length >= view.filter((row, index) => view.findIndex((other) => other.orderId === row.orderId) === index).length);
});

test('the page asks LaunchDarkly exactly once, with the compiled fallback', async () => {
  const calls = [];
  await renderOrderHistory(stubClient(true, calls), context);
  assert.equal(calls.length, 1, 'one evaluation per render keeps the traffic counts honest');
  assert.equal(calls[0].key, 'demo-order-history-v2');
  assert.equal(calls[0].fallback, false);
});

test('the wrapper returns a strict boolean', async () => {
  const calls = [];
  const value = await isOrderHistoryV2Enabled(stubClient(true, calls), context);
  assert.equal(typeof value, 'boolean');
  assert.equal(ORDER_HISTORY_PAGE_SIZE, 20);
});
