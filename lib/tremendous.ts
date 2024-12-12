import Big from "big.js";
import type { ListProductsResponseProductsInnerSkusInner } from "tremendous";

export function convertTokensToDollars(tokens: number) {
  const t = new Big(tokens);
  return t.div(13).round(1).toNumber();
}

export function convertDollarsToTokens(dollars: number) {
  const d = new Big(dollars);
  return d.times(13).round(0, 0).toNumber();
}

export function getProductSkus(
  input: ListProductsResponseProductsInnerSkusInner[]
) {
  if (input.length === 0) {
    return [];
  } else if (input.length === 1) {
    return [input[0].min, input[0].max];
  }

  // Extract, remove duplicates, and sort the values directly
  return [...new Set(input.map((range) => range.min))].sort((a, b) => a - b);
}
