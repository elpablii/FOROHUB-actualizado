'use client';

import { useActionState } from 'react';
import { crearTopicoAction } from '@/actions/topicos';
import Link from 'next/link';

export default function NuevoTopicoPage() {
  const [state, formAction, isPending] = useActionState(crearTopicoAction, null);

  return (
    <div className="flex-1 flex flex-col items-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <Link href="/" className="inline-flex items-center text-sm font-medium opacity-70 hover:opacity-100 hover:text-primary mb-6 transition-all">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver al inicio
        </Link>
        
        <div className="bg-white dark:bg-black/20 p-8 rounded-3xl border border-black/10 dark:border-white/10 shadow-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Haz una pregunta</h1>
            <p className="text-sm opacity-70">Sé claro y específico para que la comunidad pueda ayudarte mejor.</p>
          </div>

          {state?.error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-sm border border-red-500/20 font-medium">
              {state.error}
            </div>
          )}

          <form action={formAction} className="flex flex-col gap-6">
            
            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="titulo">
                Título de la pregunta
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                required
                className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                placeholder="Ej. ¿Cómo configurar CORS en Spring Boot 3?"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="nombreCurso">
                Curso / Categoría
              </label>
              <select
                id="nombreCurso"
                name="nombreCurso"
                required
                className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
              >
                <option value="">Selecciona un curso...</option>
                <option value="HTTP en la web">HTTP en la web</option>
                <option value="Challenge Forohub">Challenge Forohub</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2" htmlFor="mensaje">
                Detalles del problema
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                required
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-y"
                placeholder="Explica qué estás intentando hacer, qué código tienes y qué error estás recibiendo..."
              ></textarea>
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Publicando...' : 'Publicar Tópico'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
