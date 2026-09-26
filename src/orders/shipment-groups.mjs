// The v2 order history: one row per order, with its shipments folded into that row, and a page of
// rows rather than the whole history.
export function paginateWithShipments(orders, page, pageSize) {
  const pageCount = Math.max(1, Math.ceil(orders.length / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;
  const rows = orders.slice(start, start + pageSize).map((order) => ({
    orderId: order.id,
    placedOn: order.placedOn,
    total: order.total,
    // A customer whose order shipped in three parts wants one line about the order, not three.
    shipmentCount: order.shipments.length,
    shipments: order.shipments.map((shipment) => ({ id: shipment.id, item: shipment.item, dispatchedOn: shipment.dispatchedOn }))
  }));
  return { page: current, pageCount, rows };
}
