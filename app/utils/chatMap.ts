export type Message = {
  id: string;
  user: string;
  text: string;
  timestamp: number;
};

export const chats = new Map<string, Message[]>();

export function getChat(chatId: string) {
  return chats.get(chatId) || [];
}

export function sendMessage(chatId: string, user: string, text: string) {
  const msg: Message = {
    id: crypto.randomUUID(),
    user,
    text,
    timestamp: Date.now(),
  };
  const messages = chats.get(chatId) || [];
  messages.push(msg);
  chats.set(chatId, messages);
  return msg;
}

export function deleteChat(chatId: string) {
  chats.delete(chatId);
}
