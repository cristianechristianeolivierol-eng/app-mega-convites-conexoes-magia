'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Link as LinkIcon, Users, Save, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [convites, setConvites] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState(null);

  const [form, setForm] = useState({
    slug: '',
    titulo: '',
    subtitulo: 'Nosso Casamento',
    data_evento: '2027-05-15T18:00:00',
    data_exibicao: 'Sábado, 15 de Maio de 2027 às 18:00',
    local_nome: '',
    endereco: '',
    link_mapas: '',
    chave_pix: '',
    foto_capa: '',
    audio_url: '',
    mensagem: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    const { data: convitesData } = await supabase.from('convites').select('*').order('created_at', { ascending: false });
    const { data: rsvpsData } = await supabase.from('rsvps').select('*').order('created_at', { ascending: false });
    
    if (convitesData) setConvites(convitesData);
    if (rsvpsData) setRsvps(rsvpsData);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('convites').upsert(form, { onConflict: 'slug' });

    if (error) {
      alert('Erro ao salvar convite: ' + error.message);
    } else {
      alert('Convite salvo com sucesso!');
      setForm({
        slug: '', titulo: '', subtitulo: 'Nosso Casamento', data_evento: '',
        data_exibicao: '', local_nome: '', endereco: '', link_mapas: '',
        chave_pix: '', foto_capa: '', audio_url: '', mensagem: ''
      });
      setEditingSlug(null);
      carregarDados();
    }
  };

  const handleEdit = (convite) => {
    setEditingSlug(convite.slug);
    setForm(convite);
  };

  const handleDelete = async (slug) => {
    if (confirm(`Tem certeza que deseja apagar o convite "${slug}"?`)) {
      await supabase.from('convites').delete().eq('slug', slug);
      carregarDados();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Painel de Convites</h1>
            <p className="text-sm text-slate-500">Crie, edite e acompanhe os convites em tempo real.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Cadastro/Edição */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-rose-900">
              {editingSlug ? <Edit size={20} /> : <Plus size={20} />}
              {editingSlug ? `Editar: ${editingSlug}` : 'Novo Convite'}
            </h2>

            <form onSubmit={handleSave} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-slate-600 mb-1">Slug (Link único, ex: rosa-ejinnv)</label>
                <input
                  type="text"
                  required
                  disabled={!!editingSlug}
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full p-2 border rounded-lg bg-slate-50 focus:bg-white"
                  placeholder="nome-do-evento"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Título do Evento</label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Rosa & Jhonny"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={form.subtitulo}
                  onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Nosso Casamento / 15 Anos"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Data/Hora (ISO para Regressivo)</label>
                <input
                  type="text"
                  value={form.data_evento}
                  onChange={(e) => setForm({ ...form, data_evento: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="2027-05-15T18:00:00"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Data Formatada (Texto)</label>
                <input
                  type="text"
                  value={form.data_exibicao}
                  onChange={(e) => setForm({ ...form, data_exibicao: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Sábado, 15 de Maio às 18:00"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Nome do Local</label>
                <input
                  type="text"
                  value={form.local_nome}
                  onChange={(e) => setForm({ ...form, local_nome: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Espaço Jardim das Flores"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  value={form.endereco}
                  onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Rua das Flores, 100 - BH"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Link Google Maps / Waze</label>
                <input
                  type="text"
                  value={form.link_mapas}
                  onChange={(e) => setForm({ ...form, link_mapas: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Chave PIX / Código Copia e Cola</label>
                <textarea
                  value={form.chave_pix}
                  onChange={(e) => setForm({ ...form, chave_pix: e.target.value })}
                  className="w-full p-2 border rounded-lg h-16 font-mono text-[10px]"
                  placeholder="Chave ou código PIX"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">URL da Foto de Capa</label>
                <input
                  type="text"
                  value={form.foto_capa}
                  onChange={(e) => setForm({ ...form, foto_capa: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">URL da Música (MP3 Opcional)</label>
                <input
                  type="text"
                  value={form.audio_url}
                  onChange={(e) => setForm({ ...form, audio_url: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="https://.../musica.mp3"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Mensagem / Frase</label>
                <textarea
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  className="w-full p-2 border rounded-lg h-16"
                  placeholder="Frase de convite..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-rose-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-rose-900 transition flex items-center justify-center gap-1"
                >
                  <Save size={16} />
                  Salvar
                </button>
                {editingSlug && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSlug(null);
                      setForm({ slug: '', titulo: '', subtitulo: 'Nosso Casamento', data_evento: '', data_exibicao: '', local_nome: '', endereco: '', link_mapas: '', chave_pix: '', foto_capa: '', audio_url: '', mensagem: '' });
                    }}
                    className="bg-slate-200 text-slate-700 py-2 px-3 rounded-lg"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista de Convites e Confirmados */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Convites Ativos</h2>

              {loading ? (
                <p className="text-sm text-slate-500">Carregando convites...</p>
              ) : convites.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhum convite cadastrado ainda.</p>
              ) : (
