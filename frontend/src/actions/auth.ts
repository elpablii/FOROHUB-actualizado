'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function loginAction(prevState: any, formData: FormData) {
  const correo = formData.get('correo') as string;
  const contrasena = formData.get('contrasena') as string;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, contrasena }),
    });

    if (!response.ok) {
      return { error: 'Credenciales inválidas' };
    }

    const data: LoginResponse = await response.json();
    
    // Guardar el token en una cookie HTTP-Only usando next/headers
    const cookieStore = await cookies();
    cookieStore.set('jwt', data.jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });

  } catch (error) {
    console.error('Error de red:', error);
    return { error: 'Error de conexión con el servidor' };
  }

  // Redirigir al home después de un login exitoso
  redirect('/');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('jwt');
  redirect('/login');
}

export async function registerAction(prevState: any, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const correo = formData.get('correo') as string;
  const contrasena = formData.get('contrasena') as string;

  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, correo, contrasena }),
    });

    if (!response.ok) {
      return { error: 'Error al crear el usuario. Verifica los datos o intenta con otro correo.' };
    }
  } catch (error) {
    console.error('Error de red al registrar:', error);
    return { error: 'Error de conexión con el servidor' };
  }

  // Después de crear el usuario, podemos loguearlo automáticamente
  // o redirigirlo al login. Lo redirigiremos al login para que inicie sesión.
  redirect('/login');
}
