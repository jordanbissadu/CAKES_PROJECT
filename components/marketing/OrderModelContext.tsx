"use client";

import { createContext, useContext, useState } from "react";
import type { GalleryCake } from "@/lib/gallery";

export interface SelectedModel {
  name: string;
  ref: string;
  img: string;
}

export interface SelectedDivers {
  name: string;
  price: string;
}

interface OrderModelValue {
  selectedModel: SelectedModel | null;
  selectedDivers: SelectedDivers | null;
  orderType: string;
  details: string;
  selectCake: (cake: GalleryCake) => void;
  selectDivers: (item: SelectedDivers) => void;
  clearModel: () => void;
  setOrderType: (v: string) => void;
  setDetails: (v: string) => void;
}

const OrderModelContext = createContext<OrderModelValue | null>(null);

const DEFAULT_TYPE = "Gâteau anniversaire (6 / 10 / 12 parts)";

function scrollToForm() {
  document
    .getElementById("commander")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function OrderModelProvider({ children }: { children: React.ReactNode }) {
  const [selectedModel, setSelectedModel] = useState<SelectedModel | null>(null);
  const [selectedDivers, setSelectedDivers] = useState<SelectedDivers | null>(
    null,
  );
  const [orderType, setOrderType] = useState<string>(DEFAULT_TYPE);
  const [details, setDetails] = useState<string>("");

  const selectCake = (cake: GalleryCake) => {
    setSelectedDivers(null);
    setSelectedModel({ name: cake.name, ref: cake.ref, img: cake.img });
    setOrderType(cake.otype);
    setDetails(
      `Je m'inspire du modèle « ${cake.name} » (réf. ${cake.ref}). Merci de l'adapter à mon occasion.`,
    );
    scrollToForm();
  };

  const selectDivers = (item: SelectedDivers) => {
    setSelectedModel(null);
    setSelectedDivers(item);
    setDetails("");
    scrollToForm();
  };

  const clearModel = () => {
    setSelectedModel(null);
    setSelectedDivers(null);
  };

  return (
    <OrderModelContext.Provider
      value={{
        selectedModel,
        selectedDivers,
        orderType,
        details,
        selectCake,
        selectDivers,
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
