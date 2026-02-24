'use client';
import { Clock } from 'lucide-react';

export default function AcessoPendentePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-yellow-500/10 p-6">
            <Clock className="h-16 w-16 text-yellow-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-zinc-50">
            Acesso Pendente
          </h1>
          <p className="text-zinc-400 text-lg">
            Você ainda não tem acesso ao sistema.
          </p>
        </div>
        
        <div className="bg-zinc-800/50 rounded-lg p-6 space-y-2">
          <p className="text-zinc-300">
            Seu cadastro está sendo analisado pela nossa equipe.
          </p>
          <p className="text-zinc-300">
            Aguarde que em breve liberaremos seu acesso! 🚀
          </p>
        </div>
        
        <p className="text-sm text-zinc-500">
          Em caso de dúvidas, entre em contato com o administrador.
        </p>
      </div>
    </div>
  );
}
