import Big from "big.js";
import type { ListProductsResponseProductsInnerSkusInner } from "tremendous";

export function convertTokensToDollars(tokens: number) {
  const t = new Big(tokens);
  return t.div(13).round(1).toNumber();
}

export function getMinAndMaxProductDenominations(
  arr: ListProductsResponseProductsInnerSkusInner[]
) {
  if (!arr.length) {
    return {
      minDenomination: 0,
      maxDenomination: 0,
    };
  }

  const firstSku = arr[0];
  const lastSku = arr[arr.length - 1];
  return {
    minDenomination: firstSku.min,
    maxDenomination: lastSku.max,
  };
}
