import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, DollarSign } from "lucide-react";

const ProviderWallet = () => {
    const [balance] = useState(45000); // FCFA
    const [transactions] = useState([
        { id: "1", type: "service", amount: 5000, date: "2024-03-01", status: "completed", description: "Lavage Premium - Sedan" },
        { id: "2", type: "service", amount: 7500, date: "2024-03-02", status: "completed", description: "Lavage Intérieur - SUV" },
        { id: "3", type: "withdrawal", amount: -10000, date: "2024-03-03", status: "pending", description: "Retrait Mobile Money" },
    ]);

    return (
        <div className="space-y-8 p-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass-card border-l-4 border-l-primary overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Solde Disponible</CardTitle>
                        <Wallet className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{balance.toLocaleString()} FCFA</div>
                        <p className="text-xs text-muted-foreground mt-1">Prêt pour retrait</p>
                    </CardContent>
                </Card>

                <Card className="glass-card transition-all hover:bg-white/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Revenus du mois</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">125,000 FCFA</div>
                        <p className="text-xs text-green-500 mt-1">+12% par rapport au mois dernier</p>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Retraits en cours</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">10,000 FCFA</div>
                        <p className="text-xs text-muted-foreground mt-1">Validation sous 24h</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card col-span-1">
                    <CardHeader>
                        <CardTitle>Demander un retrait</CardTitle>
                        <CardDescription>Transférez vos gains vers votre compte Mobile Money.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm">Commission Plateforme (20%)</span>
                                <span className="font-bold">-2,500 FCFA</span>
                            </div>
                            <div className="h-px bg-white/10 my-2" />
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Net à recevoir</span>
                                <span className="text-primary">10,000 FCFA</span>
                            </div>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90 font-bold h-12">
                            Retirer via MTN / Moov
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glass-card col-span-1">
                    <CardHeader>
                        <CardTitle>Historique Récent</CardTitle>
                        <CardDescription>Suivi détaillé de vos activités financières.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                {transactions.map((tx) => (
                                    <TableRow key={tx.id} className="border-white/5 hover:bg-white/5">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${tx.amount > 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                                    {tx.amount > 0 ? (
                                                        <ArrowDownRight className={`h-4 w-4 ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`} />
                                                    ) : (
                                                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{tx.description}</p>
                                                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className={`font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                                                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} FCFA
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProviderWallet;
