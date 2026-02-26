import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Send, Loader2, User, CheckCircle } from 'lucide-react';
import { io as socketIO, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

interface Conversation {
  id: number;
  user_id: string;
  user_name: string;
  user_email: string;
  status: string;
  updated_at: string;
  last_message: string | null;
  user_message_count: string;
}

interface Message {
  id: number;
  conversation_id: number;
  sender_id: string;
  sender_role: 'user' | 'admin';
  content: string;
  created_at: string;
}

export default function AdminChatTab() {
  const token = localStorage.getItem('crm_token');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Connect socket
  useEffect(() => {
    if (!token) return;
    const socket = socketIO(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('new_message', (msg: Message) => {
      // Update conversation list to reflect last_message
      setConversations(prev => prev.map(c =>
        c.id === msg.conversation_id
          ? { ...c, last_message: msg.content, updated_at: msg.created_at }
          : c
      ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));

      // Add message if it belongs to the selected conversation
      setSelectedConv(sel => {
        if (sel?.id === msg.conversation_id) {
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
        return sel;
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!token) return;
    setLoadingConvs(true);
    try {
      const res = await fetch(`${API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConversations(data);
    } finally {
      setLoadingConvs(false);
    }
  }, [token]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // Select conversation
  const selectConversation = async (conv: Conversation) => {
    setSelectedConv(conv);
    setLoadingMsgs(true);
    try {
      const res = await fetch(`${API_URL}/chat/conversations/${conv.id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessages(data);
      // Join socket room
      socketRef.current?.emit('join_conversation', conv.id);
    } finally {
      setLoadingMsgs(false);
    }
  };

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !selectedConv || !socketRef.current) return;
    socketRef.current.emit('send_message', {
      conversationId: selectedConv.id,
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

  const closeConversation = async (convId: number) => {
    await fetch(`${API_URL}/chat/conversations/${convId}/close`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, status: 'closed' } : c));
    if (selectedConv?.id === convId) setSelectedConv(prev => prev ? { ...prev, status: 'closed' } : prev);
  };

  return (
    <div className="flex h-[500px] gap-4">
      {/* Conversation list */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Conversaciones</p>
        {loadingConvs ? (
          <div className="flex justify-center pt-8"><Loader2 className="w-5 h-5 text-red-500 animate-spin" /></div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-white/30 text-sm pt-8">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Sin conversaciones
          </div>
        ) : (
          conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className={`text-left p-3 rounded-xl border transition-all ${
                selectedConv?.id === conv.id
                  ? 'border-red-500/50 bg-red-500/10'
                  : 'border-white/5 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <User className="w-3 h-3 text-white/40 flex-shrink-0" />
                <span className="text-white text-xs font-medium truncate">{conv.user_name || conv.user_email}</span>
              </div>
              {conv.last_message && (
                <p className="text-white/40 text-xs truncate">{conv.last_message}</p>
              )}
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  conv.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/30'
                }`}>
                  {conv.status === 'open' ? 'Abierto' : 'Cerrado'}
                </span>
                <span className="text-white/25 text-xs">
                  {new Date(conv.updated_at).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Messages panel */}
      <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden">
        {!selectedConv ? (
          <div className="flex-1 flex items-center justify-center text-white/30">
            <div className="text-center">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Selecciona una conversación</p>
            </div>
          </div>
        ) : (
          <>
            {/* Conv header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div>
                <p className="text-white font-medium text-sm">{selectedConv.user_name || selectedConv.user_email}</p>
                <p className="text-white/40 text-xs">{selectedConv.user_email}</p>
              </div>
              {selectedConv.status === 'open' && (
                <button
                  onClick={() => closeConversation(selectedConv.id)}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                >
                  <CheckCircle className="w-3 h-3" /> Cerrar
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMsgs ? (
                <div className="flex justify-center pt-8"><Loader2 className="w-5 h-5 text-red-500 animate-spin" /></div>
              ) : messages.length === 0 ? (
                <div className="text-center text-white/30 text-sm pt-8">Sin mensajes aún</div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                      msg.sender_role === 'admin'
                        ? 'bg-red-600 text-white rounded-br-sm'
                        : 'bg-white/10 text-white rounded-bl-sm'
                    }`}>
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender_role === 'admin' ? 'text-red-200' : 'text-white/40'}`}>
                        {new Date(msg.created_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {selectedConv.status === 'open' ? (
              <div className="flex items-center gap-2 p-3 border-t border-white/10">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Responder al cliente..."
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
            ) : (
              <div className="p-3 border-t border-white/10 text-center text-white/30 text-xs">
                Conversación cerrada
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
