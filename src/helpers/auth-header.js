export function authHeader() {
  let deliveryToken = localStorage.getItem('deliveryToken');
  if (!deliveryToken) {
    return;
  } else {
    return { Authorization: 'Bearer ' + deliveryToken };
  }
}