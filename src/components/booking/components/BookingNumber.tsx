"use client";

import { NumberField } from "@base-ui/react/number-field";
import cirlePlus from "@/assets/circle-add.svg";
import cirleMinus from "@/assets/circle-minus.svg";
import { motion } from "motion/react";
import { staticImportSrc } from "@/lib/staticImportSrc";
import { useContext, useEffect } from "react";
import NumberValueContext from "@/context/NumberValueContext";

type updateCurrentPriceFnType = (value: null | number) => void;

interface NumberComponentProps {
    updateCurrentPrice: updateCurrentPriceFnType;
    totalAvailableBookingTime: number;
}

const BookingNumber = ({ totalAvailableBookingTime, updateCurrentPrice }: NumberComponentProps) => {
    const { numberValue, setNumberValue, clearDurationClampHint } =
        useContext(NumberValueContext);

    useEffect(() => {
        if (totalAvailableBookingTime < 2) return;
        setNumberValue((nv) => {
            const next = Math.min(nv, totalAvailableBookingTime);
            if (next !== nv) {
                updateCurrentPrice(next);
            }
            return next;
        });
    }, [totalAvailableBookingTime, setNumberValue, updateCurrentPrice]);

    return (
        <div className="bookingFlowCustDurCont">
            <NumberField.Root
                value={numberValue}
                onValueChange={(e) => {
                    if (e) {
                        setNumberValue(e);
                        updateCurrentPrice(e);
                        clearDurationClampHint();
                    }
                }}
                step={1}
                defaultValue={2}
                min={2}
                // 3. Safety: Ensure max never falls below min to prevent UI errors
                max={Math.max(2, totalAvailableBookingTime)} 
            >
                <NumberField.ScrubArea>
                    <NumberField.ScrubAreaCursor />
                </NumberField.ScrubArea>
                <NumberField.Group style={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                    <NumberField.Decrement style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                        <motion.img
                            whileTap={{ scale: 0.8, pointerEvents: 'none' }}
                            src={staticImportSrc(cirleMinus)}
                            style={{ height: '5dvh', width: '5dvh' }} />
                    </NumberField.Decrement>
                    
                    <NumberField.Input
                        className="bookingFlowDurationInput"
                        style={{ textAlign: "center" }}
                    />
                    
                    <NumberField.Increment style={{ border: 'none', background: 'none', cursor: 'pointer' }} >
                        <motion.img
                            whileTap={{ scale: 0.8, pointerEvents: 'none' }}
                            src={staticImportSrc(cirlePlus)}
                            style={{ height: '5dvh', width: '5dvh' }} />
                    </NumberField.Increment>
                </NumberField.Group >
            </NumberField.Root>
        </div>
    );
}

export default BookingNumber;