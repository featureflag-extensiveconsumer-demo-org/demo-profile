import { recentOrders } from './order-store.mjs';
import { paginateWithShipments } from './shipment-groups.mjs';

export const ORDER_HISTORY_PAGE_SIZE = 20;

// The order tab: a page of orders, with the shipments of an order folded into a single row.
export function renderOrderHistory(context, page = 1) {
  return paginateWithShipments(recentOrders(context.user.key), page, ORDER_HISTORY_PAGE_SIZE);
}
