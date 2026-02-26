import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { io as socketIO, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

interface Message {
  id: number;
  conversation_id: number;
  sender_id: string;
  sender_role: 'user' | 'admin';
  content: string;
  created_at: string;
}

interface Conversation {
  id: number;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('crm_token');

  const fetchConversation = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chat/conversation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConversation(data.conversation);
      setMessages(data.messages);
    } catch (e) {
      console.error('Error fetching conversation', e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Connect socket when chat opens
  useEffect(() => {
    if (!isOpen || !token) return;

    fetchConversation();

    const socket = socketIO(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('new_message', (msg: Message) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      if (msg.sender_role === 'admin' && !isOpen) {
        setUnread(n => n + 1);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isOpen, token, fetchConversation]);

  // Join conversation room once we have the conversation id
  useEffect(() => {
    if (conversation && socketRef.current) {
      socketRef.current.emit('join_conversation', conversation.id);
    }
  }, [conversation]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clear unread when opening
  useEffect(() => {
    if (isOpen) setUnread(0);
  }, [isOpen]);

  const sendMessage = () => {
    if (!input.trim() || !conversation || !socketRef.current) return;
    socketRef.current.emit('send_message', {
      conversationId: conversation.id,
      content: input.trim(),
    });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Only show for logged-in non-admin users
  if (!user || user.role === 'admin') return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {unread > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-red-600 text-xs font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[200] w-80 sm:w-96 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-red-600">
            <MessageCircle className="w-5 h-5 text-white" />
            <div>
              <p className="text-white font-semibold text-sm">Soporte Medellín Rental</p>
              <p className="text-red-200 text-xs">Estamos aquí para ayudarte</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[380px]">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-white/40 text-sm pt-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>¡Hola! ¿En qué podemos ayudarte?</p>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                      msg.sender_role === 'user'
                        ? 'bg-red-600 text-white rounded-br-sm'
                        : 'bg-white/10 text-white rounded-bl-sm'
                    }`}
                  >
                    {msg.sender_role === 'admin' && (
                      <p className="text-xs text-red-400 font-medium mb-1">Soporte</p>
                    )}
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender_role === 'user' ? 'text-red-200' : 'text-white/40'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-3 border-t border-white/10">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-red-500/50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
