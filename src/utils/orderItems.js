const parseQuantity = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) return 1;

  const directNumber = Number(normalized);
  if (Number.isFinite(directNumber) && directNumber > 0) return directNumber;

  const numericMatch = normalized.match(/-?\d+(?:\.\d+)?/);
  if (!numericMatch) return 1;

  const parsedNumber = Number(numericMatch[0]);
  return Number.isFinite(parsedNumber) && parsedNumber > 0 ? parsedNumber : 1;
};

const parseLineParts = (line) => line.split('|').map((part) => part.trim());

export const parseLineItems = (value) =>
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [productName = '', quantityText = '1', thirdPart = '', fourthPart = ''] = parseLineParts(line);
      const hasExplicitUom = fourthPart !== '';
      const normalizedThird = thirdPart.trim();
      const inferredPrice = normalizedThird !== '' && Number.isFinite(Number(normalizedThird));

      const uom = hasExplicitUom
        ? normalizedThird
        : inferredPrice
          ? ''
          : normalizedThird;

      const priceText = hasExplicitUom ? fourthPart.trim() : inferredPrice ? normalizedThird : '';

      return {
        productName: productName.trim(),
        quantity: parseQuantity(quantityText),
        ...(uom ? { uom } : {}),
        ...(priceText !== '' ? { price: Number(priceText) || 0 } : {}),
      };
    })
    .filter((item) => item.productName);

export const formatOrderItem = (item) => {
  if (!item?.productName) return '-';
  const quantity = item.quantity ?? 0;
  const uom = item.uom ? ` ${item.uom}` : '';
  const price = item.price !== undefined && item.price !== null ? ` @ ${item.price}` : '';
  return `${item.productName} x${quantity}${uom}${price}`;
};

