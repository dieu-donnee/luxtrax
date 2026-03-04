
import { ElementType } from "react";

export type BookingStep = "datetime" | "service" | "address" | "summary" | "payment";

export interface StepInfo {
  id: BookingStep;
  label: string;
  icon: ElementType;
}

export interface ServicePlan {
  id: string;
  name: string;
  price: number;
  description: string;
  duration?: string;
}
