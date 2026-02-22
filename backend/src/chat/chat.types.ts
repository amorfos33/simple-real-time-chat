export type JoinPayload = {
  username: string;
};

export type SendMessagePayload = {
  username: string;
  text: string;
};

export type ChatMessage = {
  id: string;
  username: string;
  text: string;
  createdAt: string;
};

export type ChatHistoryPayload = {
  messages: ChatMessage[];
};
