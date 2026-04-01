'use client';
import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function WarRoom({ incidentId }: { incidentId: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Determine WS protocol based on environment (wss vs ws)
    const host = process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'ws://localhost:8000';
    const ws = new WebSocket(`${host}/api/v1/ws/war-room/${incidentId}/ws`);
    
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    setSocket(ws);
    return () => ws.close();
  }, [incidentId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && input.trim()) {
      socket.send(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0d14]">
      {/* Live Chat Timeline */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-xs text-soc-accent font-mono mb-1">LIVE EVENT</span>
            <div className={`p-3 rounded-lg w-max max-w-md ${msg.startsWith('System') ? 'bg-soc-danger/20 text-soc-danger' : 'bg-soc-card border border-white/5'}`}>
              {msg}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-white/5 bg-soc-dark">
        <form onSubmit={sendMessage} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Run ChatOps commands (e.g., /isolate_host)..."
            className="w-full bg-[#151a2c] text-white border border-white/10 rounded-full px-6 py-3 focus:outline-none focus:border-soc-accent transition"
          />
          <button type="submit" className="absolute right-2 p-2 bg-soc-accent text-soc-dark rounded-full hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
