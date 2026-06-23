import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ForoHub - Chindio",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;

  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        {/* Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">ForoHub</span>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="/" className="text-sm font-medium hover:text-primary transition-colors">Inicio</a>
              <a href="/cursos" className="text-sm font-medium hover:text-primary transition-colors">Cursos</a>
            </nav>
            <div className="flex items-center gap-4">
              {token ? (
                <form action={async () => {
                  'use server';
                  const { cookies } = await import('next/headers');
                  const { redirect } = await import('next/navigation');
                  const cookieStore = await cookies();
                  cookieStore.delete('jwt');
                  redirect('/');
                }}>
                  <button type="submit" className="text-sm font-medium hover:text-primary transition-colors text-red-500">Cerrar sesión</button>
                </form>
              ) : (
                <>
                  <a href="/login" className="text-sm font-medium hover:text-primary transition-colors">Entrar</a>
                  <a href="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity">Regístrate</a>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Footer */}
        <footer className="border-t border-black/10 dark:border-white/10 py-6 mt-auto">
          <div className="container mx-auto text-center text-sm opacity-60 px-4">
            &copy; {new Date().getFullYear()} ForoHub-Chindio. Proyecto Desarrollo Ágil Escalado.
          </div>
        </footer>
      </body>
    </html>
  );
}
