# Simple Real-Time Chat

An MVP project of a simple real-time chat with a single chat room:
- **Backend:** NestJS + Socket.IO
- **Frontend:** Next.js + React + socket.io-client
- **Message storage:** in-memory array on the backend

## MVP Features

- enter a username;
- send a message to the chat;
- instantly receive messages in other open tabs;
- keep working after page refresh.

## Project Structure

- `backend` — server-side part (NestJS WebSocket Gateway)
- `frontend` — client-side part (chat UI on Next.js)

## Quick Start

### 1) Run backend

```bash
cd backend
npm install
npm run start:dev
```

### 2) Run frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

After startup, open `http://localhost:3000`.

## Author

- **amorfos33** (Arthur Avdymyrets)
- GitHub: `https://github.com/amorfos33`

## License

This project is licensed under the MIT License. See `LICENSE` for details.

