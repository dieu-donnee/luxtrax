import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Trash2, Plus, Sparkles, Tag, Layers, Search, MoreHorizontal, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"];

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const { toast } = useToast();

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSaveService = async (service: Partial<Service>) => {
    try {
      if (isAddMode) {
        const { error } = await (supabase.from("services") as any).insert({
          name: service.name!,
          description: service.description,
          details: service.details,
          price: service.price!,
          is_vip: service.is_vip || false,
          discount_percentage: service.discount_percentage || null,
          type: (service.type || 'carwash') as any
        });
        if (error) throw error;
        toast({ title: "Succès", description: "Standard d'excellence créé" });
      } else {
        const { error } = await (supabase.from("services") as any).update({
          name: service.name,
          description: service.description,
          details: service.details,
          price: service.price,
          is_vip: service.is_vip,
          discount_percentage: service.discount_percentage,
          type: service.type as any
        }).eq("id", service.id);
        if (error) throw error;
        toast({ title: "Succès", description: "Service ajusté avec précision" });
      }
      fetchServices();
      setIsDialogOpen(false);
      setEditingService(null);
      setIsAddMode(false);
    } catch (error) {
      console.error("Erreur:", error);
      toast({ title: "Erreur", description: "Échec de la configuration", variant: "destructive" });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Retirer ce service du catalogue d'exception ?")) return;
    try {
      const { error } = await (supabase.from("services") as any).delete().eq("id", serviceId);
      if (error) throw error;
      toast({ title: "Succès", description: "Service retiré" });
      fetchServices();
    } catch (error) {
      console.error("Erreur:", error);
      toast({ title: "Erreur", description: "Impossible de retirer le service", variant: "destructive" });
    }
  };

  const openAddDialog = () => {
    setEditingService({
      id: "",
      name: "",
      description: "",
      details: "",
      price: 0,
      is_vip: false,
      discount_percentage: 0,
      type: "carwash" as any,
      created_at: "",
      updated_at: ""
    });
    setIsAddMode(true);
    setIsDialogOpen(true);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auditing Catalog</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border-none">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">Service Catalog</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Luxury Standards Management</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="h-14 bg-[#1A1A1A] hover:bg-primary text-white font-black text-xs uppercase tracking-widest px-8 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          New Service
        </Button>
      </div>

      <Card className="rounded-[3rem] border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Service Essence</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Financials</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Category</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Tier</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors group">
                <TableCell className="py-6 px-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-[1.5rem] flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Layers size={20} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-black text-[#1A1A1A] tracking-tight">{service.name}</p>
                      <p className="text-[10px] font-medium text-gray-400 line-clamp-1 max-w-[200px]">{service.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-6 px-4 font-black text-[#1A1A1A] italic">
                  <div className="flex flex-col">
                    <span className="text-sm">{service.price.toLocaleString()} FCFA</span>
                    {service.discount_percentage && (
                      <span className="text-[9px] text-emerald-500 uppercase">-{service.discount_percentage}% applied</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-6 px-4">
                  <Badge variant="outline" className="border-gray-100 bg-gray-50/50 text-[8px] font-black uppercase tracking-widest text-gray-500 rounded-lg">
                    {service.type}
                  </Badge>
                </TableCell>
                <TableCell className="py-6 px-4">
                  {service.is_vip ? (
                    <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest px-2 py-1 flex items-center gap-1 w-fit">
                      <Sparkles size={10} />
                      VIP Elite
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-50 text-gray-400 border-none text-[8px] font-black uppercase tracking-widest px-2 py-1 w-fit">
                      Standard
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="py-6 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-primary transition-all"
                      onClick={() => {
                        setEditingService(service);
                        setIsAddMode(false);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-10 font-sans overflow-y-auto max-h-[90vh]">
          <DialogHeader className="space-y-2 mb-8 text-left">
            <DialogTitle className="text-2xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">
              {isAddMode ? "Architect Excellence" : "Refine Offering"}
            </DialogTitle>
            <DialogDescription className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-sans">
              {isAddMode ? "Define a new standard of service" : "Calibrate service parameters"}
            </DialogDescription>
          </DialogHeader>

          {editingService && (
            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Service Designation</Label>
                  <Input
                    className="h-14 bg-gray-50 border-none rounded-2xl px-6 font-medium focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Brief Description</Label>
                  <Textarea
                    className="bg-gray-50 border-none rounded-2xl p-6 font-medium focus-visible:ring-1 focus-visible:ring-primary/20 transition-all min-h-[100px]"
                    value={editingService.description || ""}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Investment (FCFA)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      type="number"
                      className="h-14 bg-gray-50 border-none rounded-2xl pl-14 pr-6 font-black italic focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                      value={editingService.price}
                      onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Discovery Privilege</Label>
                  <div className="relative">
                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      type="number"
                      className="h-14 bg-gray-50 border-none rounded-2xl pl-14 pr-6 font-black italic focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                      placeholder="Discount %"
                      value={editingService.discount_percentage || 0}
                      onChange={(e) => setEditingService({ ...editingService, discount_percentage: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Classification</Label>
                  <Select
                    value={editingService.type || 'carwash'}
                    onValueChange={(v) => setEditingService({ ...editingService, type: v as any })}
                  >
                    <SelectTrigger className="h-14 bg-gray-50 border-none rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-xl p-2 font-sans">
                      <SelectItem value="carwash" className="rounded-xl uppercase text-[10px] font-black tracking-widest italic py-3 cursor-pointer">Lux Automotive</SelectItem>
                      <SelectItem value="laundry" className="rounded-xl uppercase text-[10px] font-black tracking-widest italic py-3 cursor-pointer">Prem Laundry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Elite Tier</Label>
                    <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest leading-none">VIP Access Restriction</p>
                  </div>
                  <Checkbox
                    id="is_vip"
                    checked={editingService.is_vip}
                    onCheckedChange={(checked) => setEditingService({ ...editingService, is_vip: checked as boolean })}
                    className="h-6 w-6 rounded-lg border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>
              </div>

              <Button
                onClick={() => handleSaveService(editingService)}
                className="w-full h-16 bg-[#1A1A1A] hover:bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-[0.98] mt-4"
              >
                {isAddMode ? "Instantiate Service" : "Apply Refinement"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesManagement;