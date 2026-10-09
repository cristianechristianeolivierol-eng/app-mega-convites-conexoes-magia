import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-3xl font-bold font-serif text-rose-300">
          Convites Conexões & Magia
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          Plataforma de gestão e criação de convites digitais interativos.
        </p>
        
        <div className="pt-4">
          <Link
            href="/admin"
            className="inline-block bg-rose-700 hover:bg-rose-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
          >
            Acessar Painel do Cliente / Admin
          </Link>
        </div>
      </div>
    </div>
  );
}
