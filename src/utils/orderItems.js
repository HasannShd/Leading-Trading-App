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
const parseVatValue = (value) => {
  const normalized = String(value || '').trim();
  if (!normalized) return { vatApplicable: false };
  if (/^(no|none|n|0|vat\s*no)$/i.test(normalized)) return { vatApplicable: false };
  if (/^(yes|y|vat|applicable)$/i.test(normalized)) return { vatApplicable: true };

  const numericMatch = normalized.match(/-?\d+(?:\.\d+)?/);
  if (!numericMatch) return { vatApplicable: true };

  const parsedNumber = Number(numericMatch[0]);
  return Number.isFinite(parsedNumber) ? { vatApplicable: true, vatAmount: parsedNumber } : { vatApplicable: true };
};

export const parseLineItems = (value) =>
  String(value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (!line.includes('|')) {
        return {
          productName: line,
          quantity: 1,
        };
      }

      const [productName = '', quantityText = '1', thirdPart = '', fourthPart = '', fifthPart = ''] = parseLineParts(line);
      const hasExplicitUom = fourthPart !== '';
      const normalizedThird = thirdPart.trim();
      const inferredPrice = normalizedThird !== '' && Number.isFinite(Number(normalizedThird));
      const hasVatColumn = fifthPart !== '';

      const uom = hasVatColumn
        ? normalizedThird
        : hasExplicitUom
        ? normalizedThird
        : inferredPrice
          ? ''
          : normalizedThird;

      const vatText = hasVatColumn ? fourthPart.trim() : '';
      const priceText = hasVatColumn
        ? fifthPart.trim()
        : hasExplicitUom
          ? fourthPart.trim()
          : inferredPrice
            ? normalizedThird
            : '';
      const vatValue = parseVatValue(vatText);

      return {
        productName: productName.trim(),
        quantity: parseQuantity(quantityText),
        ...(uom ? { uom } : {}),
        ...(vatValue.vatApplicable ? { vatApplicable: true } : {}),
        ...(vatValue.vatAmount !== undefined ? { vatAmount: vatValue.vatAmount } : {}),
        ...(priceText !== '' ? { price: Number(priceText) || 0 } : {}),
      };
    })
    .filter((item) => item.productName);

export const formatOrderItem = (item) => {
  if (!item?.productName) return '-';
  const quantity = item.quantity ?? 0;
  const hasExplicitStructure = Boolean(item.uom || item.vatApplicable || item.price !== undefined && item.price !== null);
  const quantityLabel = quantity === 1 && !hasExplicitStructure ? '' : ` x${quantity}`;
  const uom = item.uom ? ` ${item.uom}` : '';
  const vat = item.vatApplicable ? ` | VAT ${item.vatAmount ?? 'Yes'}` : '';
  const price = item.price !== undefined && item.price !== null ? ` @ ${item.price}` : '';
  return `${item.productName}${quantityLabel}${uom}${vat}${price}`;
};
