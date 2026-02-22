'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import type {
  ChatHistoryPayload,
  ChatMessage,
  JoinPayload,
  SendMessagePayload,
} from '../lib/contracts';
import { socket } from '../lib/socket';

export default function Home() {
  const [usernameInput, setUsernameInput] = useState('');
  const [username, setUsername] = useState('');
  const pendingUsernameRef = useRef('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    socket.connect();

    const onHistory = (payload: ChatHistoryPayload) => {
      if (pendingUsernameRef.current) {
        setUsername(pendingUsernameRef.current);
        pendingUsernameRef.current = '';
      }
      setMessages(payload.messages);
      setError('');
    };

    const onMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    const onError = (payload: { message: string }) => {
      setError(payload.message);
      pendingUsernameRef.current = '';
    };

    socket.on('chat:history', onHistory);
    socket.on('chat:message', onMessage);
    socket.on('chat:error', onError);

    return () => {
      socket.off('chat:history', onHistory);
      socket.off('chat:message', onMessage);
      socket.off('chat:error', onError);
      socket.disconnect();
    };
  }, []);

  const joinChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanUsername = usernameInput.trim();

    if (!cleanUsername) {
      setError('Username is required');
      return;
    }

    const payload: JoinPayload = { username: cleanUsername };
    pendingUsernameRef.current = cleanUsername;
    socket.emit('chat:join', payload);
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanText = text.trim();

    if (!username || !cleanText) {
      return;
    }

    const payload: SendMessagePayload = {
      username,
      text: cleanText,
    };

    socket.emit('chat:send', payload);
    setText('');
    setError('');
  };

  return (
    <main className="page">
      <section className="chat-card">
        <h1>Public Chat</h1>

        {!username ? (
          <form onSubmit={joinChat} className="form">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={usernameInput}
              onChange={(event) => setUsernameInput(event.target.value)}
              placeholder="Enter username"
            />
            <button type="submit">Join</button>
          </form>
        ) : (
          <>
            <p className="joined-as">Joined as: {username}</p>
            <div className="messages">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`message ${message.username === username ? 'message-own' : ''}`}
                >
                  <p>
                    <strong>{message.username === username ? 'You' : message.username}:</strong>{' '}
                    {message.text}
                  </p>
                </article>
              ))}
            </div>

            <form onSubmit={sendMessage} className="form">
              <label htmlFor="message">Message</label>
              <input
                id="message"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Type message"
              />
              <button type="submit">Send</button>
            </form>
          </>
        )}

        {error ? <p className="error">{error}</p> : null}
      </section>
    </main>
  );
}
