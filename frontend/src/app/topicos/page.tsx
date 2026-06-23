import Link from "next/link";
import { fetchWithAuth, getAuthToken } from "@/services/api";
import { PageResponse, Topico } from "@/types/api";

export default async function TopicosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const token = await getAuthToken();
  const params = await searchParams;
  const cursoFilter = typeof params.curso === 'string' ? params.curso : null;
  
  let topicos: Topico[] = [];
  let error: string | null = null;

  if (token) {
    try {
      // Si hay un filtro de curso, llamamos al endpoint correspondiente
      const endpoint = cursoFilter 
        ? `/topicos/${encodeURIComponent(cursoFilter)}` 
        : '/topicos';
        
      const res = await fetchWithAuth(endpoint);
      if (res.ok) {
        const data: PageResponse<Topico> = await res.json();
        topicos = data.content;
      } else {
        error = 'No se pudieron cargar los tópicos.';
      }
    } catch (e) {
      error = 'No se pudo conectar con el servidor backend.';
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl flex-1 flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Explorar Tópicos</h1>
          {cursoFilter && (
            <p className="opacity-70 flex items-center gap-2">
              Mostrando tópicos del curso: 
              <span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">{cursoFilter}</span>
              <Link href="/topicos" className="text-xs underline hover:text-primary ml-2">Limpiar filtro</Link>
            </p>
          )}
        </div>
        <Link href="/nuevo-topico" className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
          Nueva Pregunta
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {!token ? (
          <div className="text-center p-12 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
            <h3 className="text-xl font-bold mb-2">Inicia sesión para explorar</h3>
            <p className="opacity-70 mb-6">Únete a la comunidad para ver y participar en los tópicos.</p>
            <Link href="/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
              Ir al Login
            </Link>
          </div>
        ) : error ? (
          <div className="text-center p-8 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500">
            <p>{error}</p>
          </div>
        ) : topicos.length === 0 ? (
          <div className="text-center p-12 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/20">
            <h3 className="text-xl font-bold mb-2">No se encontraron tópicos</h3>
            <p className="opacity-70 mb-6">Sé el primero en hacer una pregunta sobre este tema.</p>
            <Link href="/nuevo-topico" className="bg-black/5 dark:bg-white/10 px-6 py-2 rounded-full font-semibold hover:bg-black/10 dark:hover:bg-white/20 transition-all">
              Hacer una pregunta
            </Link>
          </div>
        ) : (
          topicos.map((topico) => (
            <div key={topico.id} className="p-6 rounded-2xl border border-black/10 dark:border-white/10 hover:border-primary/50 transition-all hover:shadow-md bg-white dark:bg-black/20 group cursor-pointer relative overflow-hidden flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="absolute left-0 top-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex-1">
                <div className="flex gap-2 items-center mb-3">
                  <Link href={`/topicos?curso=${encodeURIComponent(topico.curso)}`} className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors">
                    {topico.curso}
                  </Link>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    topico.estado === 'RESUELTO' 
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                      : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                  }`}>
                    {topico.estado.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{topico.titulo}</h3>
                <p className="opacity-70 line-clamp-1 text-sm">{topico.mensaje}</p>
              </div>

              <div className="flex items-center gap-4 mt-4 md:mt-0 text-sm opacity-70 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    {topico.usuario.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{topico.usuario}</span>
                </div>
                <span>•</span>
                <span>{new Date(topico.fechaCreacion).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
