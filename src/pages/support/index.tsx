
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail, HelpCircle, ChevronRight, MessageSquare, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Support = () => {
    const faqs = [
        "How to book a wash?",
        "Can I cancel my reservation?",
        "How to become a provider?",
        "What are the payment methods?",
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 pb-28 animate-in fade-in duration-700">
            <div className="max-w-md mx-auto space-y-10">
                {/* Support Header */}
                <div className="text-center pt-12 space-y-2">
                    <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">Support</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        Your luxury experience, assisted.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="group relative">
                        <div className="absolute inset-0 bg-blue-500/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Card className="relative p-6 flex flex-col items-center justify-center text-center space-y-3 border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-500 cursor-pointer rounded-[2rem] bg-white group-hover:-translate-y-1">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <Phone size={24} />
                            </div>
                            <span className="font-black text-[10px] uppercase tracking-widest text-[#1A1A1A]">Call Concierge</span>
                        </Card>
                    </div>
                    <div className="group relative">
                        <div className="absolute inset-0 bg-green-500/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Card className="relative p-6 flex flex-col items-center justify-center text-center space-y-3 border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-green-200/20 transition-all duration-500 cursor-pointer rounded-[2rem] bg-white group-hover:-translate-y-1">
                            <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                                <MessageSquare size={24} />
                            </div>
                            <span className="font-black text-[10px] uppercase tracking-widest text-[#1A1A1A]">WhatsApp Us</span>
                        </Card>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
                        Send a message
                    </label>
                    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-50 shadow-2xl shadow-gray-200/30 space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-primary transition-all duration-300" />
                                <Input
                                    placeholder="Subject of inquiry"
                                    className="h-14 pl-12 bg-gray-50/50 border-transparent rounded-2xl focus:bg-white focus:ring-primary/10 transition-all font-bold text-sm tracking-tight"
                                />
                            </div>
                            <Textarea
                                placeholder="Describe your issue in detail..."
                                className="min-h-[140px] rounded-2xl bg-gray-50/50 border-transparent p-6 focus:bg-white focus:ring-primary/10 transition-all font-bold text-sm leading-relaxed"
                            />
                        </div>
                        <Button className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 shadow-2xl shadow-primary/20 transition-all duration-500 group">
                            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Submit Message
                        </Button>
                    </div>
                </div>

                {/* FAQ Selection */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
                        Quick Questions
                    </label>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <button
                                key={index}
                                className="w-full flex items-center justify-between p-5 bg-white rounded-[1.5rem] border border-gray-50 shadow-sm hover:shadow-lg hover:shadow-gray-200/20 transition-all duration-500 text-left group"
                            >
                                <span className="text-xs font-black text-[#1A1A1A] tracking-tight uppercase group-hover:text-primary transition-colors">{faq}</span>
                                <div className="p-2 bg-gray-50 rounded-full group-hover:bg-primary/5 group-hover:translate-x-1 transition-all">
                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-primary" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] pt-4">
                    24/7 Dedicated Support
                </p>
            </div>
        </div>
    );
};

export default Support;
