export function unmaskCurrency(value: string): number {
  const cleanValue = value.replace(/[^\d,.]/g, "");

  const numericString = cleanValue.replace(",", ".");

  return parseFloat(numericString) || 0;
}

export function formatToBRL(value: number | ""): string {
  if (value === "" || isNaN(Number(value)) || Number(value) === 0) return "";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
