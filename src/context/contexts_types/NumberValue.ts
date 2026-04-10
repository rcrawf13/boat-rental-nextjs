import type { Dispatch, SetStateAction } from "react";

export interface NumberValue {
  numberValue: number;
  setNumberValue: Dispatch<SetStateAction<number>>;
  durationClampHint: string | null;
  clearDurationClampHint: () => void;
}