import { convertCurrency } from "./currency";

export function createCurrencyConverter(
  baseCurrency: string,
  exchangeRates: Record<string, number>,
) {
  return (amount: number, fromCurrency: string): number => {
    if (fromCurrency === baseCurrency) return amount;
    return convertCurrency(amount, fromCurrency, baseCurrency, exchangeRates);
  };
}
