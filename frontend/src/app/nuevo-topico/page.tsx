import Link from 'next/link';
import { fetchWithAuth } from '@/services/api';
import { Curso, PageResponse } from '@/types/api';
import NuevoTopicoForm from './NuevoTopicoForm';

export default async function NuevoTopicoPage() {
  let cursos: Curso[] = [];
  
  try {
    const res = await fetchWithAuth('/cursos');
    if (res.ok) {
      const data: PageResponse<Curso> = await res.json();
      cursos = data.content;
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  }

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

          <NuevoTopicoForm cursos={cursos} />
        </div>
      </div>
    </div>
  );
}
