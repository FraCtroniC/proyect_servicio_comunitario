import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface ChatbotAsistenteProps {
  roleId?: number;
  userName?: string;
}

interface Mensaje {
  emisor: 'usuario' | 'bot';
  texto: string;
}

const ROLE_LABELS: Record<number, string> = {
  1: 'Administrador',
  2: 'Control de Estudios',
  3: 'Docente',
};

const SALUDOS: Record<number, string> = {
  1: 'Bienvenido al asistente del sistema. ¿En que puedo ayudarte con la gestion del liceo?',
  2: 'Bienvenido al asistente. ¿Necesitas ayuda con los procesos academicos?',
  3: 'Hola, soy el asistente del sistema. ¿Necesitas ayuda con tus clases o calificaciones?',
};

export default function ChatbotAsistente({ roleId = 3, userName = '' }: ChatbotAsistenteProps) {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const mensajesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (abierto) {
      const nombre = userName?.trim() || 'Usuario';
      const saludo = SALUDOS[roleId] || SALUDOS[3];
      setMensajes([{ emisor: 'bot', texto: `${saludo.replace('{nombre}', nombre)}` }]);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [abierto, roleId, userName]);

  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  async function enviar() {
    const texto = input.trim();
    if (!texto || cargando) return;

    setInput('');
    setMensajes((prev) => [...prev, { emisor: 'usuario', texto }]);
    setCargando(true);

    try {
      const data = await api.chatbot.consultar(texto, roleId, userName);
      setMensajes((prev) => [...prev, { emisor: 'bot', texto: data.respuesta }]);
    } catch (err: any) {
      setMensajes((prev) => [...prev, {
        emisor: 'bot',
        texto: err?.message || 'Ocurrio un error al procesar tu consulta.',
      }]);
    } finally {
      setCargando(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKeyDown(e: { key: string; shiftKey: boolean; preventDefault: () => void }) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  return (
    <>
      {!abierto && (
        <button
          onClick={() => setAbierto(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 flex items-center justify-center z-50 cursor-pointer"
          aria-label="Abrir asistente"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {abierto && (
        <div
          className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-48px)] h-[560px] max-h-[calc(100vh-160px)] rounded-2xl flex flex-col z-50 overflow-hidden border border-slate-700/60 shadow-2xl"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            animation: 'chatbotFadeIn 0.2s ease-out',
          }}
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600/90 to-indigo-700/90 border-b border-white/10 shrink-0">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-base truncate">
                Asistente - {ROLE_LABELS[roleId] || 'Usuario'}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block" />
                <span className="text-xs text-green-300 font-medium">En línea</span>
              </div>
            </div>
            <button
              onClick={() => setAbierto(false)}
              className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              aria-label="Cerrar asistente"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={mensajesRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin"
            style={{ scrollbarWidth: 'thin' }}
          >
            {mensajes.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.emisor === 'usuario' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: 'chatbotFadeIn 0.2s ease-out' }}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-base leading-relaxed ${
                    msg.emisor === 'usuario'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-md'
                      : 'bg-slate-800/80 text-slate-200 rounded-bl-md border border-slate-700/40'
                  }`}
                  style={msg.emisor === 'bot' ? { whiteSpace: 'pre-line' } : undefined}
                >
                  {msg.texto}
                </div>
              </div>
            ))}

            {cargando && (
              <div className="flex justify-start" style={{ animation: 'chatbotFadeIn 0.2s ease-out' }}>
                <div className="bg-slate-800/80 text-slate-400 rounded-2xl rounded-bl-md px-4 py-2.5 text-base border border-slate-700/40 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  Pensando...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-700/60 bg-slate-900/80 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta..."
                disabled={cargando}
                className="flex-1 bg-slate-800/80 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-base border border-slate-700/60 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all disabled:opacity-50"
              />
              <button
                onClick={enviar}
                disabled={!input.trim() || cargando}
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                aria-label="Enviar mensaje"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatbotFadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
