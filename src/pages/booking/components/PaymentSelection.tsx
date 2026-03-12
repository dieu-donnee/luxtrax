import React from "react";
import { Check, Smartphone, CreditCard as CardIcon, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMethod {
    id: string;
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

const paymentMethods: PaymentMethod[] = [
    {
        id: "momo_mtn",
        label: "MTN Mobile Money",
        description: "Paiement instantané via MTN MoMo",
        icon: Smartphone,
        color: "bg-[#FFCC00] text-black",
    },
    {
        id: "momo_moov",
        label: "Moov Money",
        description: "Paiement sécurisé via Moov Flooz",
        icon: Smartphone,
        color: "bg-[#0066B3] text-white",
    },
    {
        id: "card",
        label: "Carte Bancaire",
        description: "Visa, Mastercard via passerelle sécurisée",
        icon: CardIcon,
        color: "bg-[#1A1A1A] text-white",
    },
    {
        id: "cash",
        label: "Espèces",
        description: "Paiement direct après la prestation",
        icon: Banknote,
        color: "bg-emerald-500 text-white",
    },
];

interface PaymentSelectionProps {
    selectedMethod: string;
    onSelectMethod: (methodId: string) => void;
}

const PaymentSelection = ({ selectedMethod, onSelectMethod }: PaymentSelectionProps) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid gap-4">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        onClick={() => onSelectMethod(method.id)}
                        className={cn(
                            "group relative flex items-center gap-5 p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300",
                            selectedMethod === method.id
                                ? "bg-white border-[#1A1A1A] shadow-xl scale-[1.02]"
                                : "bg-gray-50/50 border-transparent hover:bg-white hover:border-gray-200"
                        )}
                    >
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                            method.color
                        )}>
                            <method.icon size={24} />
                        </div>

                        <div className="flex-1 text-left">
                            <h4 className="text-sm font-black text-[#1A1A1A] tracking-tight uppercase italic">{method.label}</h4>
                            <p className="text-[10px] font-medium text-gray-400 mt-0.5">{method.description}</p>
                        </div>

                        <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                            selectedMethod === method.id
                                ? "bg-[#1A1A1A] text-white scale-100 opacity-100"
                                : "bg-gray-100 text-transparent scale-50 opacity-0"
                        )}>
                            <Check size={14} className="stroke-[3]" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500 flex-shrink-0">
                    <CardIcon size={18} />
                </div>
                <p className="text-[10px] font-medium text-blue-600 leading-relaxed">
                    <span className="font-black uppercase tracking-widest block mb-0.5">Note de sécurité</span>
                    Vos transactions MoMo s'effectuent via un protocole USSD sécurisé après confirmation sur votre mobile.
                </p>
            </div>
        </div>
    );
};

export default PaymentSelection;
