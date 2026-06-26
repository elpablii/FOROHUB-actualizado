import Link from 'next/link';
import { Topico, Respuesta, PageResponse } from '@/types/api';
import { fetchWithAuth, getAuthToken } from '@/services/api';
import RespuestaForm from './RespuestaForm';

export default async function TopicoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getAuthToken();
  
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Inicia sesión para ver este tópico</h2>
        <Link href="/login" className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium">Ir al login</Link>
      </div>
    );
  }

  let topico: Topico | null = null;
  let respuestas: Respuesta[] = [];
  let error: string | null = null;

  try {
    const resTopico = await fetchWithAuth(`/topicos/${id}`);
    if (!resTopico.ok) throw new Error('Tópico no encontrado');
    topico = await resTopico.json();

    const resRespuestas = await fetchWithAuth(`/respuestas/topico/${id}`);
    if (resRespuestas.ok) {
      const dataRespuestas: PageResponse<Respuesta> = await resRespuestas.json();
      respuestas = dataRespuestas.content;
    }
  } catch (err: any) {
    error = err.message || 'Error al cargar datos';
  }

  if (error || !topico) {
    return <div className="p-12 text-center text-red-500">{error || 'Tópico no encontrado'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl flex-1 flex flex-col gap-8">
      <Link href="/topicos" className="inline-flex items-center text-sm font-medium opacity-70 hover:opacity-100 hover:text-primary transition-all self-start">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Volver a tópicos
      </Link>

      {/* Tópico Principal */}
      <div className="bg-white dark:bg-black/20 p-8 rounded-3xl border border-black/10 dark:border-white/10 shadow-xl">
        <div className="flex gap-2 items-center mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-indigo-300 bg-primary/10 px-2 py-1 rounded-md">
            {topico.curso}
          </span>
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${
            topico.estado === 'RESUELTO' 
              ? 'bg-green-500/10 text-green-700 dark:text-green-400' 
              : 'bg-orange-500/10 text-orange-700 dark:text-orange-400'
          }`}>
            {topico.estado.replace('_', ' ')}
          </span>
          <span className="text-sm opacity-50 ml-auto">{new Date(topico.fechaCreacion).toLocaleString()}</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">{topico.titulo}</h1>
        
        <div className="prose dark:prose-invert max-w-none opacity-90 whitespace-pre-wrap mb-8 bg-black/5 dark:bg-white/5 p-6 rounded-2xl">
          {topico.mensaje}
        </div>

        <div className="flex items-center gap-3 mt-4 border-t border-black/5 dark:border-white/5 pt-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-inner">
            {topico.usuario.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{topico.usuario}</div>
            <div className="text-xs opacity-50">Autor del tópico</div>
          </div>
        </div>
      </div>

      {/* Respuestas */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Respuestas <span className="text-sm bg-black/10 dark:bg-white/10 px-2 py-1 rounded-full">{respuestas.length}</span>
        </h2>

        {respuestas.length === 0 ? (
          <div className="text-center p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 opacity-70">
            Aún no hay respuestas. ¡Sé el primero en ayudar!
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {respuestas.map(r => (
              <div key={r.id} className="bg-white dark:bg-black/10 p-6 rounded-2xl border border-black/5 dark:border-white/5 flex gap-4">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold">
                    {r.nombreAutor.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{r.nombreAutor}</span>
                    <span className="text-xs opacity-50">{new Date(r.fechaCreacion).toLocaleString()}</span>
                  </div>
                  <p className="opacity-90 whitespace-pre-wrap">{r.mensaje}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <RespuestaForm idTopico={topico.id} tituloTopico={topico.titulo} />
    </div>
  );
}
