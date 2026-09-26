import test from 'node:test';
import assert from 'node:assert/strict';
import { paginateWithShipments } from '../src/orders/shipment-groups.mjs';

const orders = Array.from({ length: 25 }, (unused, index) => ({
  id: `ORD-${index}`,
  placedOn: '2026-03-03',
  total: 1000 + index,
  shipments: [{ id: `SHP-${index}-1`, item: 'kettle', dispatchedOn: '2026-03-04' }]
}));

test('a page holds at most the page size', () => {
  const view = paginateWithShipments(orders, 1, 20);
  assert.equal(view.rows.length, 20);
  assert.equal(view.pageCount, 2);
});

test('the last page holds the remainder', () => {
  const view = paginateWithShipments(orders, 2, 20);
  assert.equal(view.rows.length, 5);
  assert.equal(view.page, 2);
});

test('a page beyond the end clamps rather than throwing', () => {
  assert.equal(paginateWithShipments(orders, 99, 20).page, 2);
  assert.equal(paginateWithShipments(orders, 0, 20).page, 1);
});

test('shipments of one order fold into a single row', () => {
  const split = [{ id: 'ORD-9', placedOn: '2026-04-04', total: 7700, shipments: [
    { id: 'SHP-9-1', item: 'headphones', dispatchedOn: '2026-04-05' },
    { id: 'SHP-9-2', item: 'cable', dispatchedOn: '2026-04-07' }
  ] }];
  const view = paginateWithShipments(split, 1, 20);
  assert.equal(view.rows.length, 1);
  assert.equal(view.rows[0].shipmentCount, 2);
});
