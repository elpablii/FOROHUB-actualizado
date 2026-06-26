'use client';

import { useActionState } from 'react';
import { crearRespuestaAction } from '@/actions/topicos';

export default function RespuestaForm({ idTopico, tituloTopico }: { idTopico: number, tituloTopico: string }) {
  const [formState, formAction, isPending] = useActionState(crearRespuestaAction, null);

  return (
    <div className="bg-primary/5 dark:bg-primary/10 p-6 md:p-8 rounded-3xl border border-primary/20">
      <h3 className="text-xl font-bold mb-4">Escribir una respuesta</h3>
      
      {formState?.error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-sm border border-red-500/20 font-medium">
          {formState.error}
        </div>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="idTopico" value={idTopico} />
        <input type="hidden" name="tituloTopico" value={tituloTopico} />
        
        <textarea
          name="mensaje"
          required
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-y"
          placeholder="Escribe tu solución o comentario aquí..."
        ></textarea>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Enviando...' : 'Enviar Respuesta'}
          </button>
        </div>
      </form>
    </div>
  );
}
