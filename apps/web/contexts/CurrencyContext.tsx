"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { fetchExchangeRates, ExchangeRates } from "@/lib/currency";

interface CurrencyContextType {
  exchangeRates: ExchangeRates;
  isLoading: boolean;
  lastUpdated: Date | null;
  refreshRates: (currency: string) => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentCurrency, setCurrentCurrency] = useState("USD");

  const refreshRates = async (currency: string) => {
    if (currency === currentCurrency && Object.keys(exchangeRates).length > 0) {
      return; // Already have rates for this currency
    }

    setIsLoading(true);
    setCurrentCurrency(currency);
    try {
      const rates = await fetchExchangeRates(currency);
      setExchangeRates(rates);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to refresh exchange rates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        exchangeRates,
        isLoading,
        lastUpdated,
        refreshRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
