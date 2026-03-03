import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, GraduationCap, CheckCircle, BookOpen, Clock } from "lucide-react";

const Academy = () => {
    const modules = [
        {
            id: "1",
            title: "Introduction à LuxtraX",
            description: "Apprenez les bases de la plateforme et comment booster vos revenus.",
            duration: "10 min",
            status: "completed",
        },
        {
            id: "2",
            title: "Techniques de Lavage Premium",
            description: "Guide complet sur l'utilisation des produits et le soin des véhicules de luxe.",
            duration: "25 min",
            status: "ongoing",
        },
        {
            id: "3",
            title: "Service Client & Professionnalisme",
            description: "Comment obtenir 5 étoiles à chaque mission.",
            duration: "15 min",
            status: "locked",
        },
    ];

    return (
        <div className="space-y-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        LuxtraX Academy
                    </h2>
                    <p className="text-muted-foreground italic">
                        "Le savoir-faire au service de l'autonomie."
                    </p>
                </div>
                <div className="bg-primary/20 p-3 rounded-full border border-primary/30">
                    <GraduationCap className="h-8 w-8 text-primary" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {modules.map((module) => (
                    <Card key={module.id} className={`glass-card border-t-2 ${module.status === 'completed' ? 'border-primary' : 'border-white/10'} overflow-hidden relative group`}>
                        {module.status === 'locked' && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-4">
                                <BookOpen className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="font-bold">Module Verrouillé</p>
                                <p className="text-xs text-muted-foreground">Complétez le module précédent pour débloquer.</p>
                            </div>
                        )}

                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={module.status === 'completed' ? 'secondary' : 'outline'} className={module.status === 'completed' ? 'bg-primary/20 text-primary border-primary/20' : ''}>
                                    {module.status === 'completed' ? 'Terminé' : module.status === 'ongoing' ? 'En cours' : 'À venir'}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {module.duration}
                                </div>
                            </div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">{module.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{module.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant={module.status === 'completed' ? 'outline' : 'default'}
                                className="w-full flex items-center gap-2 font-bold"
                                disabled={module.status === 'locked'}
                            >
                                {module.status === 'completed' ? (
                                    <>Revoir <CheckCircle className="h-4 w-4" /></>
                                ) : (
                                    <>Commencer <PlayCircle className="h-4 w-4" /></>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Pourquoi l'Academy ?
                    </CardTitle>
                    <CardContent className="pt-4 text-sm text-white/80 leading-relaxed">
                        Chez LuxtraX, la qualité est notre priorité. Tous nos prestataires doivent valider au moins **3 modules** pour être éligibles aux missions "Premium" et voir leur commission réduite. Plus vous apprenez, plus vous gagnez.
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    );
};

export default Academy;
