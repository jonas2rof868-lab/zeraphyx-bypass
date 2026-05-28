import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.auth.login.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync({
        username,
        password,
      });

      if (result.success) {
        toast.success(`Bem-vindo, ${result.username}!`);
        
        if (result.type === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = `/vendor/${result.vendorId}`;
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md relative z-10 bg-slate-900/50 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
        <div className="p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent mb-2">
              ZERAPHYX
            </h1>
            <p className="text-cyan-400 text-sm font-mono tracking-widest">BYPASS SYSTEM</p>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">
                USUÁRIO
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="bg-slate-800/50 border border-purple-500/30 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">
                SENHA
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="bg-slate-800/50 border border-purple-500/30 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-lg"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'CONECTANDO...' : 'ACESSAR SISTEMA'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-purple-500/20 text-center">
            <p className="text-xs text-slate-400 font-mono">
              Sistema de Gerenciamento de UIDs v1.0
            </p>
            <p className="text-xs text-purple-400/60 mt-2">
              © 2026 Zeraphyx Bypass. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </Card>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
