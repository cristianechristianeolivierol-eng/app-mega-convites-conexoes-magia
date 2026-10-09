import { notFound } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import ConviteClient from './ConviteClient';

export const revalidate = 0; // Atualiza instantaneamente sem guardar em cache

export async function generateMetadata({ params }) {
  const { data: convite } = await supabase
    .from('convites')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!convite) return {};

  return {
    title: `${convite.titulo} - Convite Especial`,
    description: convite.mensagem,
    openGraph: {
      title: `${convite.titulo} - Convite`,
      description: convite.mensagem,
      images: [{ url: convite.foto_capa }],
    },
  };
}

export default async function ConvitePage({ params }) {
  const { data: convite } = await supabase
    .from('convites')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!convite) {
    notFound();
  }

  // Mapeia as colunas da tabela do Supabase para as props do componente
  const conviteFormatado = {
    slug: convite.slug,
    titulo: convite.titulo,
    subtitulo: convite.subtitulo,
    dataEvento: convite.data_evento,
    dataExibicao: convite.data_exibicao,
    localNome: convite.local_nome,
    endereco: convite.endereco,
    linkMapas: convite.link_mapas,
    chavePix: convite.chave_pix,
    fotoCapa: convite.foto_capa,
    audioUrl: convite.audio_url,
    mensagem: convite.mensagem,
  };

  return <ConviteClient convite={conviteFormatado} />;
}
