import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ChatHistoryPayload,
  ChatMessage,
} from './chat.types';
import type { JoinPayload, SendMessagePayload } from './chat.types';

const PUBLIC_ROOM = 'public';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly messages: ChatMessage[] = [];
  private readonly activeUsers = new Map<string, string>();

  handleDisconnect(client: Socket): void {
    this.activeUsers.delete(client.id);
  }

  @SubscribeMessage('chat:join')
  handleJoin(
    @MessageBody() payload: JoinPayload,
    @ConnectedSocket() client: Socket,
  ): void {
    const username = payload?.username?.trim();

    if (!username) {
      client.emit('chat:error', { message: 'Username is required' });
      return;
    }

    const isTaken = Array.from(this.activeUsers.values()).includes(username);
    if (isTaken) {
      client.emit('chat:error', { message: 'Username is already taken' });
      return;
    }

    this.activeUsers.set(client.id, username);
    client.join(PUBLIC_ROOM);

    const history: ChatHistoryPayload = { messages: this.messages };
    client.emit('chat:history', history);
  }

  @SubscribeMessage('chat:send')
  handleSend(
    @MessageBody() payload: SendMessagePayload,
    @ConnectedSocket() client: Socket,
  ): void {
    const joinedUsername = this.activeUsers.get(client.id);
    const username = payload?.username?.trim();
    const text = payload?.text?.trim();

    if (!joinedUsername) {
      client.emit('chat:error', { message: 'Join chat first' });
      return;
    }

    if (!username || !text) {
      client.emit('chat:error', { message: 'Username and text are required' });
      return;
    }

    if (username !== joinedUsername) {
      client.emit('chat:error', { message: 'Invalid username for this session' });
      return;
    }

    const message: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      username,
      text,
      createdAt: new Date().toISOString(),
    };

    this.messages.push(message);
    this.server.to(PUBLIC_ROOM).emit('chat:message', message);
  }
}
