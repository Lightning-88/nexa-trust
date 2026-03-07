import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkSessionServer } from "@/feature/auth/functions";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: MainPage,
  loader: async () => {
    return await checkSessionServer();
  },
});

function MainPage() {
  const session = Route.useLoaderData();

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto shadow-sm sticky top-0 left-0 right-0 backdrop-blur-lg">
        <h1 className="text-2xl font-bold">Nexa Trust</h1>

        <div className="flex gap-3">
          {!session ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>

              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          )}
        </div>
      </nav>

      <section className="flex flex-col items-center text-center px-6 py-12">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          AI Chatbot Cerdas <br />
          Untuk Bisnis Modern
        </h2>

        <p className="max-w-2xl mb-8 text-lg">
          Nexa Trust membantu Anda membangun komunikasi otomatis yang aman,
          cepat, dan terpercaya dengan teknologi AI.
        </p>

        <div className="flex gap-4">
          {!session ? (
            <>
              <Button size="lg" asChild>
                <Link to="/register">Mulai Gratis</Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Masuk</Link>
              </Button>
            </>
          ) : (
            <Button size="lg" asChild>
              <Link to="/dashboard">Buka Dashboard</Link>
            </Button>
          )}
        </div>
      </section>

      <section className="px-6 max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-12">
          Kenapa Nexa Trust?
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">AI Pintar</CardTitle>
              <CardDescription>Respon cepat & akurat</CardDescription>
            </CardHeader>

            <CardContent>
              Sistem AI memahami konteks percakapan untuk hasil terbaik.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Keamanan Data
              </CardTitle>
              <CardDescription>Privasi terjamin</CardDescription>
            </CardHeader>

            <CardContent>
              Data Anda dilindungi dengan teknologi keamanan modern.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Mudah Digunakan
              </CardTitle>
              <CardDescription>Tanpa ribet</CardDescription>
            </CardHeader>

            <CardContent>
              Interface simpel dan ramah pengguna, cocok untuk semua level.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h3 className="text-3xl md:text-4xl font-bold">
            Mulai Gunakan Nexa Trust Hari Ini
          </h3>

          <p>Tingkatkan layanan pelanggan dengan AI chatbot terpercaya.</p>

          {!session && (
            <Button size="lg" asChild>
              <Link to="/register">Daftar Sekarang</Link>
            </Button>
          )}
        </div>
      </section>

      <footer className="border-t py-6 text-center text-slate-500">
        © {new Date().getFullYear()} Nexa Trust. All rights reserved.
      </footer>
    </main>
  );
}
