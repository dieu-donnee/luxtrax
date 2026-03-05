import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Trash2, Calendar, MapPin, User, MoreHorizontal, Clock, DollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";
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
import type { Database } from "@/integrations/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"] & {
  profiles: { full_name: string | null } | null;
  services: { name: string; price: number } | null;
};

const BookingsManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles(full_name),
          services(name, price)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings((data as unknown as Booking[]) || []);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus as any })
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
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la réservation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Réservation supprimée avec succès",
      });

      fetchBookings();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
        variant: "destructive",
      });
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return { label: "Confirmed", color: "bg-emerald-50 text-emerald-500" };
      case "pending":
        return { label: "Pending", color: "bg-orange-50 text-orange-500" };
      case "completed":
        return { label: "Completed", color: "bg-blue-50 text-blue-500" };
      case "cancelled":
        return { label: "Cancelled", color: "bg-red-50 text-red-500" };
      default:
        return { label: status, color: "bg-gray-50 text-gray-500" };
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Compiling Operations</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="rounded-[3rem] border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Order Details</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Schedule</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Investment</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Status</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => {
              const status = getStatusConfig(booking.status);
              return (
                <TableRow key={booking.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                  <TableCell className="py-6 px-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-[1.5rem] flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <Calendar size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-[#1A1A1A] tracking-tight">{booking.services?.name || 'Unknown luxury'}</p>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <User size={12} />
                          <span className="text-[10px] font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                            {booking.profiles?.full_name || 'Client Inconnu'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[#1A1A1A] text-[11px] font-black uppercase italic">
                        <Clock size={12} className="text-primary" />
                        {new Date(booking.scheduled_date).toLocaleDateString()}
                      </div>
                      <p className="text-[10px] font-medium text-gray-400">
                        {new Date(booking.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-4">
                    <div className="flex items-center gap-1.5">
                      <DollarSign size={14} className="text-emerald-500" />
                      <span className="text-sm font-black text-[#1A1A1A] tracking-tighter italic">
                        {booking.services?.price?.toLocaleString() || 0} FCFA
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-4">
                    <Badge className={`border-none rounded-xl text-[8px] font-black uppercase tracking-widest px-3 py-1 ${status.color}`}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog open={isDialogOpen && editingBooking?.id === booking.id} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setEditingBooking(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-primary transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingBooking(booking);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-10 max-w-lg font-sans">
                          <DialogHeader className="space-y-2 mb-8 text-left">
                            <DialogTitle className="text-2xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">Operational Sync</DialogTitle>
                            <DialogDescription className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Status Update</DialogDescription>
                          </DialogHeader>
                          {editingBooking && (
                            <div className="space-y-8">
                              <div className="p-6 bg-gray-50 rounded-2xl space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                                    <User size={18} />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</p>
                                    <p className="text-sm font-black text-[#1A1A1A]">{editingBooking.profiles?.full_name}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                                    <MapPin size={18} />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                                    <p className="text-sm font-medium text-[#1A1A1A] line-clamp-1">{editingBooking.address}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Current Protocol</Label>
                                <Select
                                  value={editingBooking.status}
                                  onValueChange={(value) => handleUpdateBookingStatus(editingBooking.id, value)}
                                >
                                  <SelectTrigger className="h-14 bg-gray-50 border-none rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest focus:ring-1 focus:ring-primary/20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-2xl border-none shadow-xl p-2 font-sans">
                                    <SelectItem value="pending" className="rounded-xl uppercase text-[10px] font-black tracking-widest italic py-3 cursor-pointer">Waiting Approval</SelectItem>
                                    <SelectItem value="confirmed" className="rounded-xl uppercase text-[10px] font-black tracking-widest italic py-3 cursor-pointer">Confirmed</SelectItem>
                                    <SelectItem value="completed" className="rounded-xl uppercase text-[10px] font-black tracking-widest italic py-3 cursor-pointer">Completed</SelectItem>
                                    <SelectItem value="cancelled" className="rounded-xl uppercase text-[10px] font-black tracking-widest italic py-3 cursor-pointer text-red-500">Void/Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBooking(booking.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default BookingsManagement;