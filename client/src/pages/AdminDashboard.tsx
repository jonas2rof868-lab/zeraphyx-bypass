import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Settings, Plus, Trash2, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVendorUsername, setNewVendorUsername] = useState('');
  const [newVendorPassword, setNewVendorPassword] = useState('');
  const [newVendorLimit, setNewVendorLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);
  const [editPassword, setEditPassword] = useState('');
  const [editLimit, setEditLimit] = useState(0);

  const listVendorsQuery = trpc.auth.listVendors.useQuery();
  const addVendorMutation = trpc.auth.addVendor.useMutation();
  const editVendorMutation = trpc.auth.editVendor.useMutation();
  const deleteVendorMutation = trpc.auth.removeVendor.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  useEffect(() => {
    if (listVendorsQuery.data) {
      setVendors(listVendorsQuery.data);
    }
  }, [listVendorsQuery.data]);

  const handleAddVendor = async () => {
    if (!newVendorUsername || !newVendorPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await addVendorMutation.mutateAsync({
        username: newVendorUsername,
        password: newVendorPassword,
        uidLimit: newVendorLimit,
      });
      toast.success('Vendedor adicionado com sucesso!');
      setNewVendorUsername('');
      setNewVendorPassword('');
      setNewVendorLimit(10);
      setShowAddModal(false);
      listVendorsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao adicionar vendedor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVendor = async (vendorId: number) => {
    if (!editPassword && editLimit === 0) {
      toast.error('Selecione algo para editar');
      return;
    }

    setIsLoading(true);
    try {
      await editVendorMutation.mutateAsync({
        vendorId,
        password: editPassword || undefined,
        uidLimit: editLimit || undefined,
      });
      toast.success('Vendedor atualizado com sucesso!');
      setEditingVendor(null);
      setEditPassword('');
      setEditLimit(0);
      listVendorsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao editar vendedor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este vendedor?')) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteVendorMutation.mutateAsync({ vendorId });
      toast.success('Vendedor deletado com sucesso!');
      listVendorsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao deletar vendedor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      window.location.href = '/login';
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-purple-500/30 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
              ZERAPHYX BYPASS
            </h1>
            <p className="text-cyan-400 text-sm font-mono">PAINEL ADMINISTRATIVO</p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Add Vendor Button */}
        <div className="mb-6">
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Vendedor
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border border-purple-500/30">
              <DialogHeader>
                <DialogTitle className="text-cyan-400">Adicionar Novo Vendedor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-cyan-400 mb-2">Usuário</label>
                  <Input
                    value={newVendorUsername}
                    onChange={(e) => setNewVendorUsername(e.target.value)}
                    placeholder="Nome de usuário"
                    className="bg-slate-800 border-purple-500/30 text-white"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-400 mb-2">Senha</label>
                  <Input
                    type="password"
                    value={newVendorPassword}
                    onChange={(e) => setNewVendorPassword(e.target.value)}
                    placeholder="Senha"
                    className="bg-slate-800 border-purple-500/30 text-white"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-400 mb-2">Limite de UIDs</label>
                  <Input
                    type="number"
                    value={newVendorLimit}
                    onChange={(e) => setNewVendorLimit(parseInt(e.target.value))}
                    min="1"
                    className="bg-slate-800 border-purple-500/30 text-white"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleAddVendor}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
                >
                  {isLoading ? 'Adicionando...' : 'Adicionar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vendors Table */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/30 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/30 hover:bg-transparent">
                  <TableHead className="text-cyan-400">Usuário</TableHead>
                  <TableHead className="text-cyan-400">Limite de UIDs</TableHead>
                  <TableHead className="text-cyan-400">UIDs Usados</TableHead>
                  <TableHead className="text-cyan-400">Data de Criação</TableHead>
                  <TableHead className="text-cyan-400">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id} className="border-purple-500/20 hover:bg-purple-500/10">
                    <TableCell className="text-white font-mono">{vendor.username}</TableCell>
                    <TableCell className="text-cyan-400">{vendor.uidLimit}</TableCell>
                    <TableCell className="text-green-400">{vendor.usedUids}</TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {new Date(vendor.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-purple-500/30 hover:bg-purple-500/20"
                              onClick={() => {
                                setEditingVendor(vendor);
                                setEditPassword('');
                                setEditLimit(vendor.uidLimit);
                              }}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-900 border border-purple-500/30">
                            <DialogHeader>
                              <DialogTitle className="text-cyan-400">Editar {vendor.username}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm text-cyan-400 mb-2">Nova Senha (deixe em branco para não alterar)</label>
                                <Input
                                  type="password"
                                  value={editPassword}
                                  onChange={(e) => setEditPassword(e.target.value)}
                                  placeholder="Nova senha"
                                  className="bg-slate-800 border-purple-500/30 text-white"
                                  disabled={isLoading}
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-cyan-400 mb-2">Novo Limite de UIDs</label>
                                <Input
                                  type="number"
                                  value={editLimit}
                                  onChange={(e) => setEditLimit(parseInt(e.target.value))}
                                  min="1"
                                  className="bg-slate-800 border-purple-500/30 text-white"
                                  disabled={isLoading}
                                />
                              </div>
                              <Button
                                onClick={() => handleEditVendor(vendor.id)}
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
                              >
                                {isLoading ? 'Atualizando...' : 'Atualizar'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 hover:bg-red-500/20 text-red-400"
                          onClick={() => handleDeleteVendor(vendor.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
