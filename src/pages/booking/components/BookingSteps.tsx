
import React from "react";
import type { BookingStep, StepInfo } from "../types";

interface BookingStepsProps {
  steps: StepInfo[];
  currentStep: BookingStep;
}

const BookingSteps = ({ steps, currentStep }: BookingStepsProps) => {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="mb-10 animate-fade-in">
      <div className="flex items-center justify-between gap-3 max-w-[320px] mx-auto relative px-2">
        {/* Progress Line */}
        <div className="absolute top-[18px] left-8 right-8 h-1 bg-gray-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = currentIndex > index;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2.5 relative z-10 group">
              <div className={cn(
                "w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-500",
                isActive ? "bg-primary text-white scale-110 shadow-[0_10px_20px_rgba(17,82,212,0.3)]" :
                  isCompleted ? "bg-primary/10 text-primary border border-primary/20" : "bg-white border border-gray-100 text-gray-300"
              )}>
                {isCompleted ? <Check size={16} strokeWidth={3} /> : <step.icon size={16} strokeWidth={isActive ? 2.5 : 2} />}
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                isActive ? "text-primary translate-y-0 opacity-100" : "text-gray-300 opacity-60"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default BookingSteps;
