import test from 'node:test';
import assert from 'node:assert/strict';
import { legacyOrderList } from '../src/orders/legacy-order-list.mjs';

const orders = [
  { id: 'ORD-1001', placedOn: '2026-01-01', total: 2500, shipments: [{ id: 'SHP-1', item: 'kettle', dispatchedOn: '2026-01-02' }] },
  { id: 'ORD-1002', placedOn: '2026-02-02', total: 4900, shipments: [
    { id: 'SHP-2', item: 'desk lamp', dispatchedOn: '2026-02-03' },
    { id: 'SHP-3', item: 'cable', dispatchedOn: '2026-02-05' }
  ] }
];

test('a split order appears once per shipment', () => {
  const rows = legacyOrderList(orders);
  assert.equal(rows.length, 3);
  assert.deepEqual(rows.filter((row) => row.orderId === 'ORD-1002').map((row) => row.shipmentId), ['SHP-2', 'SHP-3']);
});

test('every row carries the order total, which is what made the old page confusing', () => {
  const rows = legacyOrderList(orders);
  const split = rows.filter((row) => row.orderId === 'ORD-1002');
  assert.deepEqual(split.map((row) => row.total), [4900, 4900]);
});

test('an empty history renders no rows', () => {
  assert.deepEqual(legacyOrderList([]), []);
});
