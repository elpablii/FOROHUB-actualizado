'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function crearTopicoAction(prevState: any, formData: FormData) {
  const titulo = formData.get('titulo') as string;
  const mensaje = formData.get('mensaje') as string;
  const nombreCurso = formData.get('nombreCurso') as string;

  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    // Decodificar el token para obtener el ID del usuario
    const decoded: any = jwtDecode(token);
    const idUsuario = decoded.id;

    if (!idUsuario) {
      return { error: 'Token inválido o sin ID de usuario' };
    }

    const response = await fetch(`${API_URL}/topicos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        titulo,
        mensaje,
        nombreCurso,
        idUsuario
      }),
    });

    if (!response.ok) {
      return { error: 'Error al crear el tópico. Verifica que el curso exista.' };
    }

  } catch (error) {
    console.error('Error al crear tópico:', error);
    return { error: 'Error de conexión con el servidor' };
  }

  // Redirigir al home al terminar
  redirect('/');
}

export async function crearRespuestaAction(prevState: any, formData: FormData) {
  const mensaje = formData.get('mensaje') as string;
  const tituloTopico = formData.get('tituloTopico') as string;
  const idTopico = formData.get('idTopico') as string; // For redirecting back

  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const decoded: any = jwtDecode(token);
    const idUsuario = decoded.id;

    if (!idUsuario) {
      return { error: 'Token inválido o sin ID de usuario' };
    }

    const response = await fetch(`${API_URL}/respuestas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mensaje,
        tituloTopico,
        idUsuario,
        solucion: 'NO_RESUELTO' // Default status for a response
      }),
    });

    if (!response.ok) {
      return { error: 'Error al enviar la respuesta.' };
    }

  } catch (error) {
    console.error('Error al crear respuesta:', error);
    return { error: 'Error de conexión con el servidor' };
  }

  redirect(`/topicos/${idTopico}`);
}
