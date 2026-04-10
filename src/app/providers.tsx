"use client";

import { useState } from "react";
import dayjs from "dayjs";
import ActivePriceContext from "@/context/ActivePriceContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(2);
  const [currentPrice, setCurrentPrice] = useState("$250.00");
  const [selectedDayJSObj, setSelectedDayJSObj] = useState(dayjs());
  const [isCalendar, setIsCalendar] = useState(false);

  return (
    <ActivePriceContext.Provider
      value={{
        active,
        setActive,
        currentPrice,
        setCurrentPrice,
        selectedDayJSObj,
        setSelectedDayJSObj,
        isCalendar,
        setIsCalendar,
      }}
    >
      {children}
    </ActivePriceContext.Provider>
  );
}
