import test from 'node:test';
import assert from 'node:assert/strict';
import { ORDER_HISTORY_PAGE_SIZE, renderOrderHistory } from '../src/orders/order-history.mjs';

const context = { user: { key: 'customer-8821' } };

test('the order tab renders a page of orders', () => {
  const view = renderOrderHistory(context);
  assert.equal(view.page, 1);
  assert.ok(view.rows.length > 0);
  assert.ok(view.rows.every((row) => typeof row.shipmentCount === 'number'));
});

test('the page size is the one the template expects', () => {
  assert.equal(ORDER_HISTORY_PAGE_SIZE, 20);
});
