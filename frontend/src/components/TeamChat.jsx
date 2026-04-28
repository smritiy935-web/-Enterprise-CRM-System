import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// const API_URL = import.meta.env.VITE_API_URL;

const socket = window.io ? window.io(import.meta.env.VITE_API_URL.replace("/api", "")) : { on: () => {}, emit: () => {}, off: () => {} };

const TeamChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const { user } = useAuth();
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off('receive_message');
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const data = {
      sender: user.name,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: Date.now()
    };
    socket.emit('send_message', data);
    setMessage('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn btn-primary" 
          style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0, justifyContent: 'center', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' }}
        >
          <MessageSquare size={24} />
        </button>
      ) : (
        <div className="glass-card animate-fade" style={{ width: '350px', height: '450px', display: 'flex', flexDirection: 'column', border: '1px solid var(--accent-primary)' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(99, 102, 241, 0.1)' }}>
            <h3 style={{ fontSize: '1rem' }}>Team Collaboration</h3>
            <X size={18} cursor="pointer" onClick={() => setIsOpen(false)} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {chat.map((msg) => (
              <div key={msg.id} style={{ alignSelf: msg.sender === user.name ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px', textAlign: msg.sender === user.name ? 'right' : 'left' }}>
                  {msg.sender} • {msg.time}
                </div>
                <div style={{ 
                  padding: '10px 14px', 
                  borderRadius: '12px', 
                  fontSize: '0.9rem',
                  background: msg.sender === user.name ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: 'white',
                  borderTopRightRadius: msg.sender === user.name ? '2px' : '12px',
                  borderTopLeftRadius: msg.sender === user.name ? '12px' : '2px',
                }}>
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ padding: '15px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', flex: 1, color: 'white', outline: 'none' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px' }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TeamChat;
