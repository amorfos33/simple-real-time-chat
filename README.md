# Simple Real-Time Chat

MVP-проєкт простого real-time чату з одним чатрумом:
- **Backend:** NestJS + Socket.IO
- **Frontend:** Next.js + React + socket.io-client
- **Зберігання повідомлень:** in-memory масив на бекенді

## Можливості MVP

- введення імені користувача;
- надсилання повідомлення в чат;
- миттєве отримання повідомлень в інших відкритих вкладках;
- робота після оновлення сторінки.

## Структура проєкту

- `backend` — серверна частина (WebSocket Gateway на NestJS)
- `frontend` — клієнтська частина (інтерфейс чату на Next.js)

## Швидкий старт

### 1) Запуск backend

```bash
cd backend
npm install
npm run start:dev
```

### 2) Запуск frontend

В іншому терміналі:

```bash
cd frontend
npm install
npm run dev
```

Після запуску відкрийте `http://localhost:3000`.

## Автор

- **amorfos33** (Arthur Avdymyrets)
- GitHub: `https://github.com/amorfos33`

## Ліцензія

Проєкт ліцензовано за умовами ліцензії MIT. Деталі у файлі `LICENSE`.

