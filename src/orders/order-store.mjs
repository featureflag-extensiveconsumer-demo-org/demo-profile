// Stand-in for the orders service. Deterministic in the user key so the same customer sees the same
// page twice, which is what the rendering tests rely on.
const CATALOGUE = ['headphones', 'kettle', 'desk lamp', 'running shoes', 'notebook', 'cable'];

function shipmentsFor(orderIndex, size) {
  return Array.from({ length: size }, (unused, part) => ({
    id: `SHP-${orderIndex}-${part + 1}`,
    item: CATALOGUE[(orderIndex + part) % CATALOGUE.length],
    dispatchedOn: `2026-0${(orderIndex % 9) + 1}-1${part}`
  }));
}

export function recentOrders(userKey) {
  const seed = [...String(userKey)].reduce((total, character) => total + character.charCodeAt(0), 0);
  return Array.from({ length: 7 }, (unused, index) => {
    const orderIndex = seed + index;
    // Orders split across warehouses arrive as several shipments. That is the case the v2 view folds.
    const size = (orderIndex % 3) + 1;
    return {
      id: `ORD-${1000 + (orderIndex % 900)}`,
      placedOn: `2026-0${(index % 9) + 1}-0${(index % 9) + 1}`,
      total: 1900 + ((orderIndex * 37) % 8000),
      shipments: shipmentsFor(orderIndex, size)
    };
  });
}
