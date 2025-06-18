export function countItems(items) {
  return items.reduce((acc, obj) => {
    acc += obj.quantity;
    return acc;
  }, 0);
}