import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle2, AlertCircle, FileText, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ProviderOnboarding = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [files, setFiles] = useState<{ id_card?: File; business_permit?: File }>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id_card' | 'business_permit') => {
        if (e.target.files?.[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
        }
    };

    const handleUpload = async () => {
        if (!files.id_card) {
            toast({
                title: "Erreur",
                description: "Veuillez uploader votre pièce d'identité.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            // Logic for Supabase Storage Upload will go here once schema is ready
            // For now, simulate success for UI validation
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: "Succès",
                description: "Vos documents ont été envoyés pour validation.",
            });
            setStep(3);
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'upload.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 flex items-center justify-center">
            <Card className="glass-card max-w-2xl w-full border-0 shadow-2xl overflow-hidden">
                <div className="h-2 bg-primary/20">
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <CardHeader className="text-center pt-8">
                    <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        {step === 1 && <UserCircle className="h-8 w-8 text-primary" />}
                        {step === 2 && <FileText className="h-8 w-8 text-primary" />}
                        {step === 3 && <CheckCircle2 className="h-8 w-8 text-primary" />}
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight">
                        {step === 1 && "Bienvenue, Futur Partenaire"}
                        {step === 2 && "Documents Officiels"}
                        {step === 3 && "Demande Envoyée !"}
                    </CardTitle>
                    <CardDescription className="text-lg">
                        {step === 1 && "Complétez votre profil pour commencer à gagner des revenus."}
                        {step === 2 && "Nous avons besoin de vérifier votre identité pour la sécurité de nos clients."}
                        {step === 3 && "Notre équipe examine vos documents. Vous recevrez une notification sous 24h."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pb-12 px-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">Ville de résidence</Label>
                                    <Input id="city" placeholder="Ex: Cotonou, Porto-Novo" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Expérience (lavage)</Label>
                                    <Input id="experience" placeholder="Ex: 2 ans" />
                                </div>
                            </div>
                            <Button onClick={() => setStep(2)} className="w-full bg-primary hover:bg-primary/90 font-bold h-12 text-lg">
                                Suivant
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="grid gap-6">
                                <div className="p-4 border-2 border-dashed border-white/10 rounded-xl hover:bg-white/5 transition-colors group">
                                    <Label htmlFor="id_card" className="cursor-pointer block text-center">
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="font-semibold block">Pièce d'identité (CNI / Passeport)</span>
                                        <span className="text-xs text-muted-foreground">Format JPG, PNG ou PDF (Max 5MB)</span>
                                        <Input
                                            id="id_card"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, 'id_card')}
                                        />
                                        {files.id_card && (
                                            <span className="mt-2 block text-primary text-sm font-bold flex items-center justify-center gap-1">
                                                <CheckCircle2 className="h-4 w-4" /> {files.id_card.name}
                                            </span>
                                        )}
                                    </Label>
                                </div>

                                <div className="p-4 border-2 border-dashed border-white/10 rounded-xl hover:bg-white/5 transition-colors group">
                                    <Label htmlFor="business" className="cursor-pointer block text-center">
                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="font-semibold block">Registre de commerce (Optionnel)</span>
                                        <span className="text-xs text-muted-foreground text-center">Recommandé pour les prestataires établis</span>
                                        <Input
                                            id="business"
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => handleFileChange(e, 'business_permit')}
                                        />
                                        {files.business_permit && (
                                            <span className="mt-2 block text-primary text-sm font-bold flex items-center justify-center gap-1">
                                                <CheckCircle2 className="h-4 w-4" /> {files.business_permit.name}
                                            </span>
                                        )}
                                    </Label>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">Retour</Button>
                                <Button
                                    onClick={handleUpload}
                                    className="flex-[2] bg-primary hover:bg-primary/90 font-bold h-12"
                                    disabled={loading}
                                >
                                    {loading ? "Upload en cours..." : "Soumettre ma candidature"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center space-y-6">
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-3 text-left">
                                <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-yellow-500">Statut: En attente de validation</p>
                                    <p className="text-sm text-muted-foreground">
                                        Une fois validé, vous pourrez accéder à votre tableau de bord missions et commencer à accepter des services.
                                    </p>
                                </div>
                            </div>
                            <Button onClick={() => window.location.href = '/'} className="w-full h-12">
                                Retour au site
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProviderOnboarding;
