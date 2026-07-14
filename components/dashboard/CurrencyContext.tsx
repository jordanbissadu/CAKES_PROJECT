"use client";

import { createContext, useContext } from "react";

const CurrencyContext = createContext<string>("F");

export function CurrencyProvider({
  currency,
  children,
}: {
  currency: string;
  children: React.ReactNode;
}) {
  return (
    <CurrencyContext.Provider value={currency}>
      {children}
    </CurrencyContext.Provider>
  );
}

/** Currency label configured in Réglages (defaults to "F"). */
export function useCurrency(): string {
  return useContext(CurrencyContext);
}
