import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Eye, FileText, UserCheck } from "lucide-react";
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
            // Logic for fetching from provider_docs table once schema is ready
            // Mocking for UI demonstration
            setRequests([
                {
                    id: "1",
                    provider_id: "p1",
                    full_name: "Jean Kouassi",
                    doc_type: "Carte d'Identité",
                    status: "pending",
                    created_at: new Date().toISOString(),
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
            title: "Action effectuée",
            description: `Le prestataire a été ${action === 'approved' ? 'validé' : 'refusé'}.`,
        });
        // Update local state
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Validation Prestataires
                    </h2>
                    <p className="text-muted-foreground">
                        Vérifiez les documents et activez les nouveaux partenaires.
                    </p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold text-primary">{requests.length} demandes en attente</span>
                </div>
            </div>

            <Card className="glass-card border-0">
                <CardHeader>
                    <CardTitle>Demandes en attente</CardTitle>
                    <CardDescription>Documents soumis par les futurs prestataires LuxtraX.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-transparent">
                                <TableHead className="text-white/70">Prestataire</TableHead>
                                <TableHead className="text-white/70">Type de Doc</TableHead>
                                <TableHead className="text-white/70">Date</TableHead>
                                <TableHead className="text-white/70">Statut</TableHead>
                                <TableHead className="text-right text-white/70">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((request) => (
                                <TableRow key={request.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                    <TableCell className="font-medium">{request.full_name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            {request.doc_type}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(request.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                            En attente
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="hover:bg-primary/20 hover:text-primary">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-green-500/20 hover:text-green-500"
                                                onClick={() => handleAction(request.id, 'approved')}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-red-500/20 hover:text-red-500"
                                                onClick={() => handleAction(request.id, 'rejected')}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {requests.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        Aucune demande de validation en attente.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProviderVerification;
