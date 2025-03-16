
import React from "react";
import type { BookingStep, StepInfo } from "../types";

interface BookingStepsProps {
  steps: StepInfo[];
  currentStep: BookingStep;
}

const BookingSteps = ({ steps, currentStep }: BookingStepsProps) => {
  return (
    <div className="mb-8">
      <div className="hidden sm:block">
        <nav className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex flex-col items-center space-y-2 ${
                currentStep === step.id ? "text-blue-600" : 
                steps.findIndex(s => s.id === currentStep) > index ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === step.id ? "bg-blue-100 border-2 border-blue-600" : 
                steps.findIndex(s => s.id === currentStep) > index ? "bg-green-100 border-2 border-green-600" : "bg-gray-100"
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{step.label}</span>
            </div>
          ))}
          <div className="absolute left-0 right-0 top-1/2 -mt-px h-0.5 bg-gray-200 -z-10"></div>
        </nav>
      </div>
      <div className="sm:hidden">
        <p className="text-sm font-medium text-blue-600">
          Étape {steps.findIndex(s => s.id === currentStep) + 1} sur {steps.length}: {steps.find(s => s.id === currentStep)?.label}
        </p>
      </div>
    </div>
  );
};

export default BookingSteps;
