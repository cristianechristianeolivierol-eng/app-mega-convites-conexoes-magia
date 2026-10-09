'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart, Gift, CheckCircle2, Music, Volume2, VolumeX, Copy, Check } from 'lucide-react';

export default function ConviteClient({ convite }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [nome, setNome] = useState('');
  const [acompanhantes, setAcompanhantes] = useState('1');

  // Contador Regressivo
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    if (convite.audioUrl) {
      const audioObj = new Audio(convite.audioUrl);
      audioObj.loop = true;
      setAudio(audioObj);
    }

    const target = new Date(convite.dataEvento).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [convite]);

  const toggleAudio = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(convite.chavePix);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode fazer um fetch() enviando os dados para seu backend / API
    setRsvpSent(true);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 pb-20 flex flex-col items-center">
      
      {/* Botão Flutuante de Música */}
      {convite.audioUrl && (
        <button
          onClick={toggleAudio}
          className="fixed top-5 right-5 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-stone-200 text-rose-800 hover:scale-105 transition"
          aria-label="Música de fundo"
        >
          {isPlaying ? <Volume2 size={22} className="animate-pulse" /> : <VolumeX size={22} />}
        </button>
      )}

      {/* Capa e Título */}
      <div className="w-full max-w-md bg-white shadow-xl overflow-hidden min-h-screen flex flex-col">
        <div className="relative h-96 w-full">
          <img
            src={convite.fotoCapa}
            alt={convite.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-center text-white">
            <span className="uppercase tracking-widest text-xs font-semibold text-rose-200 mb-1">{convite.subtitulo}</span>
            <h1 className="text-4xl font-serif font-bold mb-2">{convite.titulo}</h1>
          </div>
        </div>

        {/* Mensagem Principal */}
        <div className="p-8 text-center bg-rose-50/50">
          <Heart className="mx-auto text-rose-500 mb-3 fill-rose-500/20" size={28} />
          <p className="font-serif italic text-stone-600 leading-relaxed text-sm">
            "{convite.mensagem}"
          </p>
        </div>

        {/* Regressivo */}
        <div className="p-6 bg-stone-900 text-white text-center">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Faltam Apenas</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-stone-800 p-2 rounded-lg">
              <span className="text-xl font-bold font-mono text-rose-300">{timeLeft.dias}</span>
              <p className="text-[10px] text-stone-400 uppercase">Dias</p>
            </div>
            <div className="bg-stone-800 p-2 rounded-lg">
              <span className="text-xl font-bold font-mono text-rose-300">{timeLeft.horas}</span>
              <p className="text-[10px] text-stone-400 uppercase">Horas</p>
            </div>
            <div className="bg-stone-800 p-2 rounded-lg">
              <span className="text-xl font-bold font-mono text-rose-300">{timeLeft.minutos}</span>
              <p className="text-[10px] text-stone-400 uppercase">Min</p>
            </div>
            <div className="bg-stone-800 p-2 rounded-lg">
              <span className="text-xl font-bold font-mono text-rose-300">{timeLeft.segundos}</span>
              <p className="text-[10px] text-stone-400 uppercase">Seg</p>
            </div>
          </div>
        </div>

        {/* Data e Local */}
        <div className="p-8 space-y-6 text-center">
          <div className="space-y-2">
            <Calendar className="mx-auto text-rose-700" size={24} />
            <h2 className="font-bold text-lg text-stone-900">Data & Horário</h2>
            <p className="text-sm text-stone-600">{convite.dataExibicao}</p>
          </div>

          <hr className="border-stone-200 my-4" />

          <div className="space-y-2">
            <MapPin className="mx-auto text-rose-700" size={24} />
            <h2 className="font-bold text-lg text-stone-900">Localização</h2>
            <p className="font-medium text-stone-800 text-sm">{convite.localNome}</p>
            <p className="text-xs text-stone-500">{convite.endereco}</p>
            
            <a
              href={convite.linkMapas}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-full hover:bg-stone-800 transition shadow-md"
            >
              Ver no Google Maps / Waze
            </a>
          </div>
        </div>

        {/* Presente / PIX */}
        <div className="p-8 bg-rose-50/30 text-center border-t border-b border-stone-200">
          <Gift className="mx-auto text-rose-700 mb-2" size={24} />
          <h2 className="font-bold text-lg text-stone-900">Lista de Presentes (PIX)</h2>
          <p className="text-xs text-stone-600 mb-4">Sua presença é nosso maior presente! Caso deseje nos presentear, utilize a chave PIX abaixo:</p>
          
          <button
            onClick={handleCopyPix}
            className="w-full py-3 px-4 bg-white border border-rose-200 text-rose-900 font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 active:scale-95 transition"
          >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            {copied ? 'Chave PIX Copiada!' : 'Copiar Chave PIX'}
          </button>
        </div>

        {/* Botão de RSVP */}
        <div className="p-6 mt-auto">
          <button
            onClick={() => setShowRsvpModal(true)}
            className="w-full py-4 bg-rose-800 hover:bg-rose-900 text-white font-bold text-sm tracking-wide rounded-xl shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} />
            CONFIRMAR PRESENÇA
          </button>
        </div>

      </div>

      {/* Modal de RSVP */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowRsvpModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-xl font-bold"
            >
              ✕
            </button>

            {!rsvpSent ? (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <h3 className="text-xl font-serif font-bold text-stone-900 text-center">Confirmar Presença</h3>
                <p className="text-xs text-stone-500 text-center">Por favor, informe seus dados até 10 dias antes do evento.</p>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Maria Silva"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Total de Pessoas (incluindo você)</label>
                  <select
                    value={acompanhantes}
                    onChange={(e) => setAcompanhantes(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="1">Apenas eu (1)</option>
                    <option value="2">2 Pessoas</option>
                    <option value="3">3 Pessoas</option>
                    <option value="4">4 Pessoas ou mais</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-800 text-white font-bold text-xs rounded-xl shadow hover:bg-rose-900 transition"
                >
                  Enviar Confirmação
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 size={48} className="mx-auto text-emerald-600" />
                <h3 className="text-lg font-bold text-stone-900">Presença Confirmada!</h3>
                <p className="text-xs text-stone-600">Agradecemos a sua confirmação. Esperamos por você!</p>
                <button
                  onClick={() => { setShowRsvpModal(false); setRsvpSent(false); }}
                  className="mt-4 px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
