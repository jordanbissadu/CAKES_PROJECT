"use client";

import { createContext, useContext, useState } from "react";
import type { GalleryCake } from "@/lib/gallery";

export interface SelectedModel {
  name: string;
  ref: string;
  img: string;
}

interface OrderModelValue {
  selectedModel: SelectedModel | null;
  orderType: string;
  details: string;
  selectCake: (cake: GalleryCake) => void;
  clearModel: () => void;
  setOrderType: (v: string) => void;
  setDetails: (v: string) => void;
}

const OrderModelContext = createContext<OrderModelValue | null>(null);

const DEFAULT_TYPE = "Gâteau anniversaire (6 / 10 / 12 parts)";

export function OrderModelProvider({ children }: { children: React.ReactNode }) {
  const [selectedModel, setSelectedModel] = useState<SelectedModel | null>(null);
  const [orderType, setOrderType] = useState<string>(DEFAULT_TYPE);
  const [details, setDetails] = useState<string>("");

  const selectCake = (cake: GalleryCake) => {
    setSelectedModel({ name: cake.name, ref: cake.ref, img: cake.img });
    setOrderType(cake.otype);
    setDetails(
      `Je m'inspire du modèle « ${cake.name} » (réf. ${cake.ref}). Merci de l'adapter à mon occasion.`,
    );
    document
      .getElementById("commander")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearModel = () => setSelectedModel(null);

  return (
    <OrderModelContext.Provider
      value={{
        selectedModel,
        orderType,
        details,
        selectCake,
        clearModel,
        setOrderType,
        setDetails,
      }}
    >
      {children}
    </OrderModelContext.Provider>
  );
}

export function useOrderModel(): OrderModelValue {
  const ctx = useContext(OrderModelContext);
  if (!ctx)
    throw new Error("useOrderModel must be used within <OrderModelProvider>");
  return ctx;
}
