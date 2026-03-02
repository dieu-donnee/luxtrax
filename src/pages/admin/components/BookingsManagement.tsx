import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  status: "pending" | "ongoing" | "completed" | "cancelled";
  scheduled_date: string;
  address: string;
  notes: string;
  created_at: string;
  profiles: {
    full_name: string;
  } | null;
  services: {
    name: string;
    price: number;
  } | null;
}

const BookingsManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await (supabase
        .from("bookings") as any)
        .select(`
          *,
          profiles(full_name),
          services(name, price)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings((data as unknown as Booking[]) || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: "pending" | "ongoing" | "completed" | "cancelled") => {
    try {
      const { error } = await (supabase
        .from("bookings") as any)
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Statut de la réservation mis à jour",
      });

      fetchBookings();
      setIsDialogOpen(false);
      setEditingBooking(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la réservation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      return;
    }

    try {
      const { error } = await (supabase
        .from("bookings") as any)
        .delete()
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Réservation supprimée avec succès",
      });

      fetchBookings();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmée";
      case "pending":
        return "En attente";
      case "completed":
        return "Terminée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  if (loading) {
    return <div>Chargement des réservations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Réservations</CardTitle>
        <CardDescription>
          Gérer toutes les réservations de la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date prévue</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.profiles?.full_name || "Utilisateur inconnu"}
                </TableCell>
                <TableCell>{booking.services?.name || "Service inconnu"}</TableCell>
                <TableCell>
                  {new Date(booking.scheduled_date).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(booking.status)}>
                    {getStatusLabel(booking.status)}
                  </Badge>
                </TableCell>
                <TableCell>{booking.services?.price || 0}€</TableCell>
                <TableCell className="max-w-xs truncate">
                  {booking.address}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingBooking(booking)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier la réservation</DialogTitle>
                          <DialogDescription>
                            Changer le statut de la réservation
                          </DialogDescription>
                        </DialogHeader>
                        {editingBooking && (
                          <div className="space-y-4">
                            <div>
                              <p><strong>Client:</strong> {editingBooking.profiles?.full_name}</p>
                              <p><strong>Service:</strong> {editingBooking.services?.name}</p>
                              <p><strong>Date:</strong> {new Date(editingBooking.scheduled_date).toLocaleString()}</p>
                              <p><strong>Adresse:</strong> {editingBooking.address}</p>
                              {editingBooking.notes && (
                                <p><strong>Notes:</strong> {editingBooking.notes}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium">Statut:</label>
                              <Select
                                value={editingBooking.status}
                                onValueChange={(value) =>
                                  handleUpdateBookingStatus(editingBooking.id, value as "pending" | "ongoing" | "completed" | "cancelled")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">En attente</SelectItem>
                                  <SelectItem value="confirmed">Confirmée</SelectItem>
                                  <SelectItem value="completed">Terminée</SelectItem>
                                  <SelectItem value="cancelled">Annulée</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BookingsManagement;