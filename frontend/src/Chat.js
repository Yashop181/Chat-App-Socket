import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';


const socket = io('http://localhost:5000');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/messages')
      .then(response => {
        setMessages(response.data);
      });

    socket.on('chat message', (msg) => {
      setMessages(messages => [...messages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    const msg = { username, message };
    socket.emit('chat message', msg);
    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat App</div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.username}: </strong>{msg.message}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
