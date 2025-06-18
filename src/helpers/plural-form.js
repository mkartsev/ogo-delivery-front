export function pluralForm(count, words) {
  // Использование:
  // pluralForm(number, ['товар', 'товара', 'товаров'])
  let cases = [2, 0, 1, 1, 1, 2]
  return count + ' ' + words[ (count % 100 > 4 && count % 100 < 20) ? 2 : cases[ Math.min(count % 10, 5)] ]
}