import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Edit2, LogOut } from 'lucide-react';

const PRICING = {
  1: 0.5,
  7: 0.5,
  30: 1,
};

export default function VendorDashboard() {
  const params = useParams<{ vendorId: string }>();
  const vendorId = parseInt(params?.vendorId || '0');

  const [uids, setUids] = useState<any[]>([]);
  const [vendorData, setVendorData] = useState<any>(null);
  const [accountId, setAccountId] = useState('');
  const [selectedDays, setSelectedDays] = useState<'1' | '7' | '30'>('1');
  const [isLoading, setIsLoading] = useState(false);
  const [editingUID, setEditingUID] = useState<any>(null);
  const [editAccountId, setEditAccountId] = useState('');

  const myUIDsQuery = trpc.auth.myUIDs.useQuery({ vendorId });
  const listVendorsQuery = trpc.auth.listVendors.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();

  useEffect(() => {
    if (myUIDsQuery.data) {
      setUids(myUIDsQuery.data);
    }
  }, [myUIDsQuery.data]);

  useEffect(() => {
    if (listVendorsQuery.data) {
      const vendor = listVendorsQuery.data.find(v => v.id === vendorId);
      if (vendor) {
        setVendorData(vendor);
      }
    }
  }, [listVendorsQuery.data, vendorId]);

  const addUIDMutation = trpc.uid.addUID.useMutation();

  const handleRegisterUID = async () => {
    if (!accountId) {
      toast.error('Digite o ID da conta');
      return;
    }

    setIsLoading(true);
    try {
      await addUIDMutation.mutateAsync({
        vendorId,
        accountId,
        durationDays: selectedDays,
      });
      toast.success(`UID ${accountId} registrado por ${selectedDays} dia(s)!`);
      setAccountId('');
      myUIDsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao registrar UID');
    } finally {
      setIsLoading(false);
    }
  };

  const changeUIDMutation = trpc.uid.changeUID.useMutation();

  const handleEditUID = async () => {
    if (!editAccountId) {
      toast.error('Digite o novo ID da conta');
      return;
    }

    setIsLoading(true);
    try {
      await changeUIDMutation.mutateAsync({
        uidId: editingUID.id,
        newAccountId: editAccountId,
      });
      toast.success('UID alterado com sucesso!');
      setEditingUID(null);
      setEditAccountId('');
      myUIDsQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao editar UID');
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

  const totalUids = uids.length;
  const uidLimit = vendorData?.uidLimit || 0;
  const usedUids = vendorData?.usedUids || 0;
  const price1Day = PRICING[1 as keyof typeof PRICING];
  const price7Days = PRICING[7 as keyof typeof PRICING];
  const price30Days = PRICING[30 as keyof typeof PRICING];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-purple-500/30 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
              ZERAPHYX BYPASS
            </h1>
            <p className="text-cyan-400 text-sm font-mono">PAINEL DO VENDEDOR</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/30 p-6">
            <p className="text-cyan-400 text-sm font-mono mb-2">MEUS IDS GERADOS</p>
            <p className="text-4xl font-bold text-white">{totalUids}</p>
          </Card>
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/30 p-6">
            <p className="text-cyan-400 text-sm font-mono mb-2">USO DO LIMITE</p>
            <p className="text-4xl font-bold text-white">{usedUids}/{uidLimit}</p>
            {usedUids >= uidLimit && (
              <p className="text-xs text-red-400 mt-2">⚠️ Limite atingido!</p>
            )}
          </Card>
          <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/30 p-6">
            <p className="text-cyan-400 text-sm font-mono mb-2">TABELA DE PREÇOS</p>
            <div className="space-y-1 text-sm">
              <p className="text-orange-400">1 Dia: {price1Day} Limite</p>
              <p className="text-orange-400">7 Dias: {price7Days} Limite</p>
              <p className="text-orange-400">30 Dias: {price30Days} Limite</p>
            </div>
          </Card>
        </div>

        {/* Register UID Form */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/30 p-6 mb-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-4">DURAÇÃO (DIAS)</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm text-cyan-400 mb-2">ID da Conta</label>
                <Input
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder="Digite o ID da conta"
                  className="bg-slate-800 border-purple-500/30 text-white"
                  disabled={isLoading}
                />
              </div>
              <div className="w-32">
                <label className="block text-sm text-cyan-400 mb-2">Duração</label>
                <Select value={selectedDays} onValueChange={(value: any) => setSelectedDays(value)}>
                  <SelectTrigger className="bg-slate-800 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-500/30">
                    <SelectItem value="1">1 Dia</SelectItem>
                    <SelectItem value="7">7 Dias</SelectItem>
                    <SelectItem value="30">30 Dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleRegisterUID}
                disabled={isLoading || !accountId}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
              >
                Registrar
              </Button>
            </div>
          </div>
        </Card>

        {/* UIDs Table */}
        <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/30 overflow-hidden">
          <div className="p-6 border-b border-purple-500/30">
            <h2 className="text-xl font-bold text-cyan-400">Histórico de IDs registrados por você.</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/30 hover:bg-transparent">
                  <TableHead className="text-cyan-400">ACCOUNT ID</TableHead>
                  <TableHead className="text-cyan-400">DURAÇÃO</TableHead>
                  <TableHead className="text-cyan-400">DATA REGISTRO</TableHead>
                  <TableHead className="text-cyan-400">EXPIRAÇÃO</TableHead>
                  <TableHead className="text-cyan-400">STATUS</TableHead>
                  <TableHead className="text-cyan-400">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uids.map((uid) => (
                  <TableRow key={uid.id} className="border-purple-500/20 hover:bg-purple-500/10">
                    <TableCell className="text-white font-mono">{uid.accountId}</TableCell>
                    <TableCell className="text-cyan-400">{uid.durationDays} dias</TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {new Date(uid.registeredAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {new Date(uid.expiresAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        uid.status === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {uid.status === 'ativo' ? 'Ativo' : 'Expirado'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-purple-500/30 hover:bg-purple-500/20"
                            onClick={() => {
                              setEditingUID(uid);
                              setEditAccountId(uid.accountId);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-900 border border-purple-500/30">
                          <DialogHeader>
                            <DialogTitle className="text-cyan-400">Editar UID</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm text-cyan-400 mb-2">Novo ID da Conta</label>
                              <Input
                                value={editAccountId}
                                onChange={(e) => setEditAccountId(e.target.value)}
                                placeholder="Novo ID"
                                className="bg-slate-800 border-purple-500/30 text-white"
                                disabled={isLoading}
                              />
                            </div>
                            <Button
                              onClick={handleEditUID}
                              disabled={isLoading}
                              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
                            >
                              {isLoading ? 'Atualizando...' : 'Atualizar'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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
