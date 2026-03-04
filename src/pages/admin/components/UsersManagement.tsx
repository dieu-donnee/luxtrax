import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Search, UserPlus, MoreHorizontal, Mail, Shield, User, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const UsersManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (updatedUser: Profile) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: updatedUser.full_name,
          phone_number: updatedUser.phone_number,
          role: updatedUser.role,
          address: updatedUser.address,
        })
        .eq("id", updatedUser.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Utilisateur mis à jour avec succès",
      });

      fetchUsers();
      setIsDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });

      fetchUsers();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Directory</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border-none">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" size={18} />
          <Input
            placeholder="Search users..."
            className="pl-12 h-14 bg-gray-50 border-none rounded-2xl text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="h-14 bg-[#1A1A1A] hover:bg-primary text-white font-black text-xs uppercase tracking-widest px-8 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2">
          <UserPlus size={18} />
          Add User
        </Button>
      </div>

      <Card className="rounded-[3rem] border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">User Profile</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Role</TableHead>
              <TableHead className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group">
                <TableCell className="py-6 px-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-[1.2rem] flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all overflow-hidden border border-transparent group-hover:border-primary/20">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-[#1A1A1A] tracking-tight">{user.full_name || 'Sans nom'}</p>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Mail size={12} />
                        <span className="text-[10px] font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                          {user.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-6 px-4">
                  <div className="flex items-center gap-2">
                    <Badge className={`border-none rounded-xl text-[8px] font-black uppercase tracking-widest px-3 py-1 ${user.role === 'admin' ? 'bg-primary/10 text-primary' :
                        user.role === 'provider' ? 'bg-emerald-50 text-emerald-500' :
                          'bg-blue-50 text-blue-500'
                      }`}>
                      <div className="flex items-center gap-1.5">
                        <Shield size={10} />
                        {user.role}
                      </div>
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="py-6 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog open={isDialogOpen && editingUser?.id === user.id} onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (!open) setEditingUser(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-primary transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingUser(user);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-10 max-w-lg font-sans">
                        <DialogHeader className="space-y-2 mb-8 text-left">
                          <DialogTitle className="text-2xl font-black text-[#1A1A1A] tracking-tighter uppercase italic">Refine Profile</DialogTitle>
                          <DialogDescription className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrative Adjustments</DialogDescription>
                        </DialogHeader>
                        {editingUser && (
                          <div className="space-y-8">
                            <div className="grid gap-6">
                              <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Identity</Label>
                                <Input
                                  className="h-14 bg-gray-50 border-none rounded-2xl px-6 font-medium focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                                  value={editingUser.full_name || ""}
                                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                                />
                              </div>
                              <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Protocol</Label>
                                <Input
                                  className="h-14 bg-gray-50 border-none rounded-2xl px-6 font-medium focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
                                  value={editingUser.phone_number || ""}
                                  onChange={(e) => setEditingUser({ ...editingUser, phone_number: e.target.value })}
                                />
                              </div>
                              <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Authority Level</Label>
                                <Select
                                  value={editingUser.role}
                                  onValueChange={(v) => setEditingUser({ ...editingUser, role: v as any })}
                                >
                                  <SelectTrigger className="h-14 bg-gray-50 border-none rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest focus:ring-1 focus:ring-primary/20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-2xl border-none shadow-xl p-2 font-sans">
                                    <SelectItem value="client" className="rounded-xl uppercase text-[10px] font-black tracking-widest italic py-3 cursor-pointer">Client</SelectItem>
                                    <SelectItem value="provider" className="rounded-xl uppercase text-[10px] font-black tracking-widest italic py-3 cursor-pointer">Provider</SelectItem>
                                    <SelectItem value="admin" className="rounded-xl uppercase text-[10px] font-black tracking-widest italic py-3 cursor-pointer">Administrator</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button
                              className="w-full h-16 bg-[#1A1A1A] hover:bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-[0.98]"
                              onClick={() => handleUpdateUser(editingUser)}
                            >
                              Sync Changes
                            </Button>
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
                        handleDeleteUser(user.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 mx-auto">
              <Search size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-[#1A1A1A] tracking-tight">No Users Found</p>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Adjust your search parameters</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UsersManagement;