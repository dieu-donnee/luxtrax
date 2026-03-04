import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
    bookingId: string;
    providerId: string;
    clientId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ReviewForm = ({ bookingId, providerId, clientId, isOpen, onClose, onSuccess }: ReviewFormProps) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({
                title: "Note requise",
                description: "Veuillez sélectionner au moins une étoile",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await (supabase
                .from("reviews") as any)
                .insert({
                    booking_id: bookingId,
                    provider_id: providerId,
                    client_id: clientId,
                    rating,
                    comment,
                    status: "published", // Auto-publish for now or use 'pending' for moderation
                });

            if (error) throw error;

            toast({
                title: "Merci pour votre avis !",
                description: "Votre retour aide la communauté LuxtraX.",
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error submitting review:", error);
            toast({
                title: "Erreur",
                description: "Impossible d'enregistrer l'avis",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-10 max-w-md font-sans">
                <DialogHeader className="space-y-2 mb-8 text-center sm:text-left">
                    <DialogTitle className="text-2xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">Notez l'Expérience</DialogTitle>
                    <DialogDescription className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Votre avis définit l'excellence du service</DialogDescription>
                </DialogHeader>

                <div className="space-y-8">
                    <div className="flex justify-center gap-2 py-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-transform active:scale-90"
                            >
                                <Star
                                    size={36}
                                    className={cn(
                                        "transition-all duration-300",
                                        (hoveredRating || rating) >= star
                                            ? "fill-primary text-primary scale-110 drop-shadow-[0_0_10px_rgba(255,45,85,0.2)]"
                                            : "text-gray-200"
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Commentaire (Optionnel)</label>
                        <Textarea
                            placeholder="Décrivez la qualité de la prestation..."
                            className="bg-gray-50 border-none rounded-2xl p-6 font-medium focus-visible:ring-1 focus-visible:ring-primary/20 transition-all min-h-[120px]"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full h-16 bg-[#1A1A1A] hover:bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-[0.98]"
                    >
                        {isSubmitting ? "Envoi..." : "Publier l'Avis"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewForm;
