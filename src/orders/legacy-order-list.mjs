// The order list the profile page served before v2: one flat row per shipment, no paging.
//
// A customer whose order shipped in three parts saw that order three times, with no indication the
// rows belonged together. That is the thing v2 fixed, and the only reason this file still exists is
// that the flag can still send traffic here.
//
// TODO: remove after the v2 rollout completes (2026-06).
export function legacyOrderList(orders) {
  return orders.flatMap((order) => order.shipments.map((shipment) => ({
    orderId: order.id,
    placedOn: order.placedOn,
    total: order.total,
    shipmentId: shipment.id,
    item: shipment.item,
    dispatchedOn: shipment.dispatchedOn
  })));
}
