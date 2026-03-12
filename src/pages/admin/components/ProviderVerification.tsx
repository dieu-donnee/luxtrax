import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Eye, FileText, UserCheck, ShieldCheck, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProviderVerificationRequest {
    id: string;
    provider_id: string;
    full_name: string;
    doc_type: string;
    status: string;
    created_at: string;
}

const ProviderVerification = () => {
    const [requests, setRequests] = useState<ProviderVerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            // Mocking logic for demonstration - in real app, fetch from a table like 'provider_verifications'
            setRequests([
                {
                    id: "1",
                    provider_id: "p1",
                    full_name: "Jean Kouassi",
                    doc_type: "Carte d'Identité",
                    status: "pending",
                    created_at: new Date().toISOString(),
                },
                {
                    id: "2",
                    provider_id: "p2",
                    full_name: "Awa Traoré",
                    doc_type: "Permis de Conduire",
                    status: "pending",
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                }
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        toast({
            title: action === 'approved' ? "Accès Accordé" : "Demande Rejetée",
            description: `Le dossier du prestataire a été ${action === 'approved' ? 'validé avec succès' : 'mis à l\'écart'}.`,
        });
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verifying Credentials</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border-none">
                <div className="space-y-1">
                    <h3 className="text-xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">Identity Verification</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Provider Onboarding Control</p>
                </div>
                <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100">
                    <Clock className="text-orange-500 w-4 h-4" />
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">{requests.length} Pending Profiles</span>
                </div>
            </div>

            <Card className="rounded-[3rem] border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="border-none hover:bg-transparent">
                            <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Candidate</TableHead>
                            <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Document Asset</TableHead>
                            <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Submission Date</TableHead>
                            <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Status</TableHead>
                            <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                <TableCell className="py-6 px-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-[1.2rem] flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all overflow-hidden border border-transparent group-hover:border-primary/20">
                                            <User size={20} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-black text-[#1A1A1A] tracking-tight">{request.full_name}</p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">ID: {request.provider_id}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg w-fit">
                                        <FileText className="h-3.5 w-3.5 text-gray-400" />
                                        <span className="text-[10px] font-black uppercase tracking-tight text-gray-600 italic">{request.doc_type}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-6 px-4 font-medium text-gray-400 text-xs italic">
                                    {new Date(request.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                </TableCell>
                                <TableCell className="py-6 px-4">
                                    <Badge className="bg-orange-50 text-orange-500 border-none rounded-xl text-[8px] font-black uppercase tracking-widest px-2 py-1 flex items-center gap-1 w-fit">
                                        <Clock size={10} />
                                        Awaiting Audit
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-6 px-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-400">
                                            <Eye size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-10 h-10 rounded-xl hover:bg-emerald-50 text-gray-400 hover:text-emerald-500 transition-all border border-transparent hover:border-emerald-100"
                                            onClick={() => handleAction(request.id, 'approved')}
                                        >
                                            <Check size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="w-10 h-10 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                                            onClick={() => handleAction(request.id, 'rejected')}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {requests.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={5} className="py-24 text-center">
                                    <div className="w-20 h-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-300 mx-auto mb-4">
                                        <ShieldCheck size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-[#1A1A1A] tracking-tight italic">All Clear</p>
                                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">No pending profile audits at this strictly vetted time.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default ProviderVerification;
