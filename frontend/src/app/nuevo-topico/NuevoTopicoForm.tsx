'use client';

import { useActionState } from 'react';
import { crearTopicoAction } from '@/actions/topicos';
import { Curso } from '@/types/api';

export default function NuevoTopicoForm({ cursos }: { cursos: Curso[] }) {
  const [state, formAction, isPending] = useActionState(crearTopicoAction, null);

  return (
    <>
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
            className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
          >
            <option value="" className="dark:bg-slate-900 dark:text-white">Selecciona un curso...</option>
            {cursos.map(curso => (
              <option key={curso.id} value={curso.nombre} className="dark:bg-slate-900 dark:text-white">
                {curso.nombre}
              </option>
            ))}
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
    </>
  );
}
