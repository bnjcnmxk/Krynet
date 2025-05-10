// src/pages/ChatPage.tsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const ChatPage = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('message', msg => {
      setMessages(prev => [...prev, msg]);
    });
  }, []);

  const sendMessage = () => {
    socket.emit('message', input);
    setInput('');
  };

  return (
    <div className="p-6 bg-gray-900 text-white h-screen">
      <h1 className="text-2xl font-bold mb-4">Krynet Chat</h1>
      <div className="space-y-2 overflow-y-scroll h-96 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="bg-gray-700 p-2 rounded">{msg}</div>
        ))}
      </div>
      <input
        className="p-2 w-full text-black"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button className="mt-2 bg-blue-600 px-4 py-2 rounded" onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
