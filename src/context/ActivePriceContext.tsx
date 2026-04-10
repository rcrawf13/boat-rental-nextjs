"use client";

import { createContext, type Dispatch, type SetStateAction} from "react";
import dayjs, {Dayjs} from "dayjs";
interface  ActivePriceContextTypes {
    active:number;
    setActive: Dispatch<SetStateAction<number>>;
    currentPrice:string;
    setCurrentPrice: Dispatch<SetStateAction<string>>;
    selectedDayJSObj:Dayjs
    setSelectedDayJSObj: Dispatch<SetStateAction<Dayjs>>;
    isCalendar: boolean;
    setIsCalendar: Dispatch<SetStateAction<boolean>>;
}

const ActivePriceContext = createContext<ActivePriceContextTypes>({
    active:2,
    setActive: () => {},
    currentPrice:'$200.00',
    setCurrentPrice: () => {},
    selectedDayJSObj: dayjs(),
    setSelectedDayJSObj: ()=> dayjs(),
    isCalendar:false,
    setIsCalendar:()=>false
});

export default ActivePriceContext;