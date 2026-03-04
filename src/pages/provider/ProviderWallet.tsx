import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, ShieldCheck, Landmark, Percent, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ProviderWallet = () => {
    const { profile } = useAuth();
    const balance = (profile as any)?.balance || 0;
    const commissionRate = (profile as any)?.commission_rate || 20;

    const [transactions] = useState([
        { id: "1", type: "service", amount: 5000, date: "23 Mars 2024", status: "completed", description: "Lavage Premium - Range Rover" },
        { id: "2", type: "service", amount: 7500, date: "22 Mars 2024", status: "completed", description: "Full Detailing - Porsche 911" },
        { id: "3", type: "withdrawal", amount: -10000, date: "21 Mars 2024", status: "pending", description: "Retrait Mobile Money" },
    ]);

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 pb-28 animate-in fade-in duration-700">
            <div className="max-w-2xl mx-auto space-y-10">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">My Earnings</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Financial Overview</p>
                </div>

                <Card className="relative overflow-hidden bg-primary p-8 rounded-[2.5rem] border-none shadow-2xl shadow-primary/30">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet size={120} />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Available Balance</p>
                            <h2 className="text-4xl font-black text-white tracking-tighter italic">
                                {balance.toLocaleString()} <span className="text-xl opacity-80">FCFA</span>
                            </h2>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={14} />
                            Verified Account
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-xl shadow-gray-200/10 space-y-2">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                            <Percent size={20} />
                        </div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Commission</p>
                        <p className="text-lg font-black text-[#1A1A1A] tracking-tight">{commissionRate}%</p>
                    </Card>
                    <Card className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-xl shadow-gray-200/10 space-y-2">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                            <TrendingUp size={20} />
                        </div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Revenue Mensuel</p>
                        <p className="text-lg font-black text-[#1A1A1A] tracking-tight">125k F</p>
                    </Card>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-2xl shadow-gray-200/20 space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1A1A1A]">Recent Transfers</h3>
                        <Landmark size={18} className="text-gray-300" />
                    </div>

                    <Table>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                    <TableCell className="py-5 px-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-transform group-hover:scale-110 ${tx.amount > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                                {tx.amount > 0 ? <ArrowDownRight size={22} /> : <ArrowUpRight size={22} />}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-[#1A1A1A] tracking-tight">{tx.description}</p>
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{tx.date}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right py-5 px-0">
                                        <span className={`text-sm font-black tracking-tight ${tx.amount > 0 ? 'text-green-500' : 'text-[#1A1A1A]'}`}>
                                            {tx.amount > 0 ? '+' : ''}{Math.abs(tx.amount).toLocaleString()}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Button className="w-full h-16 bg-[#1A1A1A] hover:bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl transition-all active:scale-95">
                        Withdraw Earnings
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProviderWallet;
