import React, { useState, useEffect } from "react";
import { Upload, FileCheck, AlertCircle, Trash2, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProviderDoc {
    id: string;
    doc_type: string;
    doc_url: string;
    status: "pending" | "approved" | "rejected" | "awaiting_correction";
    notes?: string;
}

const DocumentUpload = () => {
    const [docs, setDocs] = useState<ProviderDoc[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchDocs = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await (supabase as any)
                .from("provider_docs")
                .select("*")
                .eq("provider_id", user.id);

            if (error) throw error;
            setDocs((data as any) || []);
        } catch (error) {
            console.error("Error fetching docs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Fichier trop volumineux",
                description: "La taille maximale est de 5MB",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Math.random()}.${fileExt}`;
            const filePath = `provider_docs/${fileName}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from("verification_docs")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Insert record in provider_docs
            const { error: dbError } = await (supabase as any)
                .from("provider_docs")
                .insert({
                    provider_id: user.id,
                    doc_type: "ID_CARD", // Simple default
                    doc_url: filePath,
                    status: "pending"
                });

            if (dbError) throw dbError;

            toast({
                title: "Document envoyé",
                description: "Il sera vérifié par nos administrateurs sous 24h.",
            });
            fetchDocs();
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: "Erreur d'envoi",
                description: "Impossible d'uploader le document.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const getStatusDisplay = (status: string) => {
        switch (status) {
            case "approved":
                return { icon: ShieldCheck, color: "text-emerald-500", label: "Approuvé", bg: "bg-emerald-50" };
            case "pending":
                return { icon: Clock, color: "text-amber-500", label: "En attente", bg: "bg-amber-50" };
            case "rejected":
                return { icon: AlertCircle, color: "text-red-500", label: "Rejeté", bg: "bg-red-50" };
            default:
                return { icon: FileCheck, color: "text-gray-400", label: "Inconnu", bg: "bg-gray-100" };
        }
    };

    if (loading) return null;

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">
                    Expert Verification
                </label>
                <p className="text-[9px] text-gray-400 font-medium pl-1">Upload ID to access premium missions</p>
            </div>

            <div className="grid gap-3">
                {docs.map((doc) => {
                    const status = getStatusDisplay(doc.status);
                    return (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4">
                                <div className={cn("p-2.5 rounded-xl", status.bg, status.color)}>
                                    <status.icon size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[#1A1A1A] uppercase tracking-tight italic">Piece d'Identité</p>
                                    <p className={cn("text-[9px] font-bold uppercase tracking-widest", status.color)}>{status.label}</p>
                                </div>
                            </div>
                            {doc.status === "rejected" && (
                                <button className="p-2 text-red-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    );
                })}

                {docs.length === 0 && (
                    <div className="relative group">
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept=".jpg,.jpeg,.png,.pdf"
                        />
                        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] transition-all group-hover:bg-white group-hover:border-primary/30 group-hover:shadow-xl">
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                <Upload size={24} />
                            </div>
                            <p className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest italic">Uploader CNI/Passeport</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Max 5MB • JPG, PNG, PDF</p>
                        </div>
                    </div>
                )}
            </div>

            {isUploading && (
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Upload en cours...</p>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
