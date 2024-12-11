import Big from "big.js";

export function convertTokensToDollars(tokens: number) {
  const t = new Big(tokens);
  return t.div(13).round(1).toNumber();
}
