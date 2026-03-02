import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
      console.error("Erreur lors de la récupération des services:", error);
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
  }, [fetchServices]);

  const handleSaveService = async (service: Partial<Service>) => {
    try {
      if (isAddMode) {
        const { error } = await (supabase
          .from("services") as any)
          .insert({
            name: service.name!,
            description: service.description,
            details: service.details,
            price: service.price!,
            is_vip: service.is_vip || false,
            discount_percentage: service.discount_percentage || null,
            type: (service.type || 'carwash') as "carwash" | "laundry"
          });

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Service créé avec succès",
        });
      } else {
        const { error } = await (supabase
          .from("services") as any)
          .update({
            name: service.name,
            description: service.description,
            details: service.details,
            price: service.price,
            is_vip: service.is_vip,
            discount_percentage: service.discount_percentage,
            type: service.type as "carwash" | "laundry"
          })
          .eq("id", service.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Service mis à jour avec succès",
        });
      }

      fetchServices();
      setIsDialogOpen(false);
      setEditingService(null);
      setIsAddMode(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le service",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      return;
    }

    try {
      const { error } = await (supabase
        .from("services") as any)
        .delete()
        .eq("id", serviceId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Service supprimé avec succès",
      });

      fetchServices();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le service",
        variant: "destructive",
      });
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
      type: "carwash" as "carwash" | "laundry",
      created_at: "",
      updated_at: new Date().toISOString()
    });
    setIsAddMode(true);
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setIsAddMode(false);
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Chargement des services...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestion des Services</CardTitle>
            <CardDescription>
              Gérer tous les services de la plateforme
            </CardDescription>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un service
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>VIP</TableHead>
              <TableHead>Remise</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.price}€</TableCell>
                <TableCell>
                  <Badge variant="outline">{service.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={service.is_vip ? "default" : "secondary"}>
                    {service.is_vip ? "VIP" : "Standard"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {service.discount_percentage ? `${service.discount_percentage}%` : "Aucune"}
                </TableCell>
                <TableCell>
                  {new Date(service.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isAddMode ? "Ajouter un service" : "Modifier le service"}
              </DialogTitle>
              <DialogDescription>
                {isAddMode ? "Créer un nouveau service" : "Modifier les informations du service"}
              </DialogDescription>
            </DialogHeader>
            {editingService && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du service</Label>
                  <Input
                    id="name"
                    value={editingService.name}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingService.description || ""}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="details">Détails</Label>
                  <Textarea
                    id="details"
                    value={editingService.details || ""}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        details: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={editingService.price}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Remise (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={editingService.discount_percentage || 0}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          discount_percentage: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_vip"
                    checked={editingService.is_vip}
                    onCheckedChange={(checked) =>
                      setEditingService({
                        ...editingService,
                        is_vip: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="is_vip">Service VIP</Label>
                </div>
                <Button
                  onClick={() => handleSaveService(editingService)}
                  className="w-full"
                >
                  {isAddMode ? "Créer le service" : "Sauvegarder"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ServicesManagement;