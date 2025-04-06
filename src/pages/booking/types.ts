
import { ElementType } from "react";

export type BookingStep = "datetime" | "address" | "summary";

export interface StepInfo {
  id: BookingStep;
  label: string;
  icon: ElementType;
}
