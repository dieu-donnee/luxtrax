
import React from "react";

interface BookingLayoutProps {
  children: React.ReactNode;
}

const BookingLayout = ({ children }: BookingLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Réserver un service</h1>
        {children}
      </div>
    </div>
  );
};

export default BookingLayout;
