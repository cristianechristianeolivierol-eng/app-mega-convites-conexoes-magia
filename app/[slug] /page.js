import { notFound } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import ConviteClient from './ConviteClient';

export const revalidate = 0; // Garante renderização dinâmica em tempo real
export const dynamic = 'force-dynamic'; // Evita pré-renderização estática com erro no build

export async function generateMetadata({ params }) {
  try {
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
  } catch (error) {
    return { title: 'Convite Especial' };
  }
}

export default async function ConvitePage({ params }) {
  let convite = null;

  try {
    const { data } = await supabase
      .from('convites')
      .select('*')
      .eq('slug', params.slug)
      .single();

    convite = data;
  } catch (error) {
    console.error('Erro ao buscar convite no Supabase:', error);
  }

  if (!convite) {
    notFound();
  }

  // Mapeia as colunas do banco para as propriedades do componente
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
