import { ORDER_HISTORY_V2 } from '../flags/keys.mjs';
import { isEnabled } from '../flags/client.mjs';
import { recentOrders } from './order-store.mjs';
import { legacyOrderList } from './legacy-order-list.mjs';
import { paginateWithShipments } from './shipment-groups.mjs';

export const ORDER_HISTORY_PAGE_SIZE = 20;

export async function isOrderHistoryV2Enabled(client, context) {
  return isEnabled(client, ORDER_HISTORY_V2, context);
}

// The order tab. v2 pages the list and folds the shipments of an order into a single row; the pre-v2
// path returns one flat row per shipment, which the old template still expects.
export async function renderOrderHistory(client, context, page = 1) {
  const orders = recentOrders(context.user.key);
  const paginated = await isOrderHistoryV2Enabled(client, context);
  if (paginated) {
    return { paginated, view: paginateWithShipments(orders, page, ORDER_HISTORY_PAGE_SIZE) };
  }
  return { paginated, view: legacyOrderList(orders) };
}
