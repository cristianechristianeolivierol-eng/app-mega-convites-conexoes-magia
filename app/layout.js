import './globals.css';

export const metadata = {
  title: 'Convites Digitais Interativos',
  description: 'Seu convite digital elegante e interativo.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-50 text-slate-800 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
