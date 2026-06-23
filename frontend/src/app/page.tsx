import Link from "next/link";
import { fetchWithAuth, getAuthToken } from "@/services/api";
import { PageResponse, Topico } from "@/types/api";

export default async function Home() {
  const token = await getAuthToken();
  let topicos: Topico[] = [];
  let error: string | null = null;

  if (token) {
    try {
      const res = await fetchWithAuth('/topicos');
      if (res.ok) {
        const data: PageResponse<Topico> = await res.json();
        topicos = data.content;
      } else {
        error = 'La sesión expiró o no tienes acceso. Intenta iniciar sesión nuevamente.';
      }
    } catch (e) {
      error = 'No se pudo conectar con el servidor backend.';
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl flex-1">
      {/* Hero Section */}
      <section className="text-center py-16 px-4 bg-gradient-to-b from-primary/10 to-transparent rounded-3xl mb-12 border border-primary/10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
          Resuelve tus dudas de <span className="text-primary">programación</span>
        </h1>
        <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto mb-8">
          Únete a nuestra comunidad de desarrolladores. Pregunta, responde y aprende sobre Java, Spring Boot, React y más.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/nuevo-topico" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold text-lg hover:shadow-lg hover:opacity-90 transition-all">
            Hacer una Pregunta
          </Link>
          <Link href="/topicos" className="inline-block bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-6 py-3 rounded-full font-semibold text-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all">
            Explorar Tópicos
          </Link>
        </div>
      </section>

      {/* Main Layout: Sidebar + Feed */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Feed de Tópicos */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Tópicos Recientes</h2>
            <div className="flex gap-2">
              <button className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">Todos</button>
              <button className="text-sm px-3 py-1.5 rounded-full font-medium opacity-60 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Resueltos</button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {!token ? (
              <div className="text-center p-12 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                <h3 className="text-xl font-bold mb-2">Inicia sesión para ver los tópicos</h3>
                <p className="opacity-70 mb-6">Debes estar registrado y autenticado para interactuar con la comunidad.</p>
                <Link href="/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
                  Ir al Login
                </Link>
              </div>
            ) : error ? (
              <div className="text-center p-8 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500">
                <p>{error}</p>
                <Link href="/login" className="inline-block mt-4 text-sm font-bold underline">Volver a intentar</Link>
              </div>
            ) : topicos.length === 0 ? (
              <div className="text-center p-8 rounded-2xl border border-black/10 dark:border-white/10">
                <p className="opacity-70">Aún no hay tópicos publicados.</p>
              </div>
            ) : (
              topicos.map((topico) => (
                <div key={topico.id} className="p-6 rounded-2xl border border-black/10 dark:border-white/10 hover:border-primary/50 transition-colors bg-white dark:bg-black/20 group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
                        {topico.curso}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                        topico.estado === 'RESUELTO' 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                          : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      }`}>
                        {topico.estado.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-sm opacity-50">{new Date(topico.fechaCreacion).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{topico.titulo}</h3>
                  <p className="opacity-70 line-clamp-2 mb-4 text-sm">{topico.mensaje}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-purple-500"></div>
                      <span className="text-sm font-medium">{topico.usuario}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full md:w-64 flex flex-col gap-6 shrink-0">
          <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/20">
            <h3 className="font-bold mb-4">Cursos Populares</h3>
            <div className="flex flex-col gap-2">
              <button className="flex justify-between items-center text-sm py-1 opacity-80 hover:text-primary hover:opacity-100 transition-colors text-left">
                <span>Spring Boot</span>
                <span className="bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded text-xs">12</span>
              </button>
              <button className="flex justify-between items-center text-sm py-1 opacity-80 hover:text-primary hover:opacity-100 transition-colors text-left">
                <span>React & Next.js</span>
                <span className="bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded text-xs">8</span>
              </button>
              <button className="flex justify-between items-center text-sm py-1 opacity-80 hover:text-primary hover:opacity-100 transition-colors text-left">
                <span>Bases de Datos</span>
                <span className="bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded text-xs">5</span>
              </button>
            </div>
          </div>
          
          <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10">
            <h3 className="font-bold mb-2">¿Tienes una duda?</h3>
            <p className="text-sm opacity-80 mb-4">Nuestra comunidad está lista para ayudarte con tus problemas de código.</p>
            <Link href="/nuevo-topico" className="block text-center w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Preguntar ahora
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
}
