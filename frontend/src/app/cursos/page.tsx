import Link from "next/link";
import { fetchWithAuth, getAuthToken } from "@/services/api";
import { PageResponse } from "@/types/api";

interface Curso {
  id: number;
  nombre: string;
  categoria: string;
}

export default async function CursosPage() {
  const token = await getAuthToken();
  let cursos: Curso[] = [];
  let error: string | null = null;

  if (token) {
    try {
      const res = await fetchWithAuth('/cursos');
      if (res.ok) {
        const data: PageResponse<Curso> = await res.json();
        cursos = data.content;
      } else {
        error = 'No se pudieron cargar los cursos.';
      }
    } catch (e) {
      error = 'No se pudo conectar con el servidor backend.';
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl flex-1 flex flex-col">
      {/* Header */}
      <section className="text-center py-16 px-4 bg-gradient-to-b from-primary/10 to-transparent rounded-3xl mb-12 border border-primary/10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Aprende con nuestros <span className="text-primary">cursos</span>
        </h1>
        <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
          Explora diferentes rutas de aprendizaje y únete a los tópicos de discusión de la comunidad.
        </p>
      </section>

      {/* Grid de Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!token ? (
          <div className="col-span-full text-center p-12 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
            <h3 className="text-xl font-bold mb-2">Inicia sesión para ver los cursos</h3>
            <p className="opacity-70 mb-6">Debes estar autenticado para acceder al material.</p>
            <Link href="/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
              Ir al Login
            </Link>
          </div>
        ) : error ? (
          <div className="col-span-full text-center p-8 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500">
            <p>{error}</p>
          </div>
        ) : cursos.length === 0 ? (
          <div className="col-span-full text-center p-8 rounded-2xl border border-black/10 dark:border-white/10">
            <p className="opacity-70">Aún no hay cursos disponibles.</p>
          </div>
        ) : (
          cursos.map((curso) => (
            <div key={curso.id} className="p-6 rounded-2xl border border-black/10 dark:border-white/10 hover:border-primary/50 transition-all hover:-translate-y-1 bg-white dark:bg-black/20 group cursor-pointer relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">
                  {curso.categoria}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{curso.nombre}</h3>
              <p className="opacity-70 text-sm mb-6 flex-1">
                Aprende todo lo necesario sobre {curso.nombre} y resuelve tus dudas junto a la comunidad.
              </p>
              
              <Link 
                href={`/topicos?curso=${encodeURIComponent(curso.nombre)}`} 
                className="mt-auto block text-center bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 py-2 rounded-lg font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                Explorar Tópicos
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
