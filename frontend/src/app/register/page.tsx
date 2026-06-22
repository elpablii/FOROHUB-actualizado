'use client';

import { useActionState } from 'react';
import { registerAction } from '@/actions/auth';
import Link from 'next/link';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-black/20 p-8 rounded-3xl border border-black/10 dark:border-white/10 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Crea tu cuenta</h1>
          <p className="text-sm opacity-70">Únete a ForoHub para hacer preguntas</p>
        </div>

        {state?.error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-sm border border-red-500/20 text-center font-medium">
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="nombre">
              Nombre o Apodo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="correo">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              required
              className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="contrasena">
              Contraseña
            </label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl mt-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm opacity-70">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
