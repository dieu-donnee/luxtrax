import React from "react";

interface BookingLayoutProps {
  children: React.ReactNode;
}

const BookingLayout = ({ children }: BookingLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32 pt-8 px-4 font-sans animate-fade-in">
      <div className="max-w-[440px] mx-auto space-y-10">
        {children}
      </div>
    </div>
  );
};

export default BookingLayout;
