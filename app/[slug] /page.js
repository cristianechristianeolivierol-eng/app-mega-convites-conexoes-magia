import { notFound } from 'next/navigation';
import ConviteClient from './ConviteClient';

// Banco de dados em memória (ou substitua por chamada ao Supabase/Firebase)
const CONVITES_DB = {
  'rosa-ejinnv': {
    titulo: 'Rosa & Jhonny',
    subtitulo: 'Nosso Casamento',
    dataEvento: '2027-05-15T18:00:00',
    dataExibicao: 'Sábado, 15 de Maio de 2027 às 18:00',
    localNome: 'Espaço Jardim das Flores',
    endereco: 'Rua das Camélias, 1000 - Belo Horizonte, MG',
    linkMapas: 'https://maps.google.com/?q=Espaco+Jardim+das+Flores',
    chavePix: '00020126360014BR.GOV.BCB.PIX0114+55319999999995204000053039865802BR5915Rosa+e+Jhonny6009Contagem62070503***63041234',
    fotoCapa: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    mensagem: 'Com a bênção de nossos pais, convidamos você para celebrar o dia mais especial de nossas vidas!'
  }
};

export async function generateMetadata({ params }) {
  const convite = CONVITES_DB[params.slug];
  if (!convite) return {};

  return {
    title: `${convite.titulo} - Convite Especial`,
    description: convite.mensagem,
    openGraph: {
      title: `${convite.titulo} - Convite de Casamento`,
      description: convite.mensagem,
      images: [{ url: convite.fotoCapa }],
    },
  };
}

export default function ConvitePage({ params }) {
  const convite = CONVITES_DB[params.slug];

  if (!convite) {
    notFound();
  }

  return <ConviteClient convite={convite} />;
}
