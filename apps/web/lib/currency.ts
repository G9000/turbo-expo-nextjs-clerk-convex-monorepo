// Currency exchange rate utilities
export interface ExchangeRates {
  [currency: string]: number;
}

export const SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
] as const;

export async function fetchExchangeRates(
  baseCurrency: string
): Promise<ExchangeRates> {
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // Return fallback rates if API fails
    return getFallbackRates(baseCurrency);
  }
}

function getFallbackRates(baseCurrency: string): ExchangeRates {
  const fallbackRates: { [key: string]: ExchangeRates } = {
    USD: {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 149.5,
      CAD: 1.36,
      AUD: 1.52,
      CHF: 0.88,
      CNY: 7.24,
      INR: 83.12,
      MXN: 17.05,
      MYR: 4.45,
      SGD: 1.35,
    },
    EUR: {
      USD: 1.09,
      EUR: 1,
      GBP: 0.86,
      JPY: 162.5,
      CAD: 1.48,
      AUD: 1.65,
      CHF: 0.96,
      CNY: 7.88,
      INR: 90.45,
      MXN: 18.55,
      MYR: 4.85,
      SGD: 1.47,
    },
  };

  return fallbackRates[baseCurrency] || fallbackRates.USD;
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): number {
  if (fromCurrency === toCurrency) return amount;

  // rates are relative to the base currency that was used to fetch them
  // To convert FROM a currency TO base: divide by the rate
  // To convert FROM base TO a currency: multiply by the rate

  // If converting from a non-base currency to another currency
  // We need to first convert to base, then to target
  const rateFrom = rates[fromCurrency];
  const rateTo = rates[toCurrency];

  if (rateFrom && rateTo) {
    // Convert to base first (divide), then to target (multiply)
    return (amount / rateFrom) * rateTo;
  } else if (rateTo) {
    // fromCurrency is the base, just multiply
    return amount * rateTo;
  } else if (rateFrom) {
    // toCurrency is the base, just divide
    return amount / rateFrom;
  }

  // Otherwise return original amount
  return amount;
}

export function getCurrencySymbol(currencyCode: string): string {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);
  return currency?.symbol || currencyCode;
}
