import { makeAutoObservable } from "mobx";

export type From = "user" | "ai";


export interface ChatResponse {
  content: string;
  sources: string[];
}

export interface ChatMessage {
  from: From;
  message: ChatResponse | string;
  date: Date;
  id: string;
}

class ChatService {
  constructor() {
    makeAutoObservable(this);
  }
  loading: boolean = false;
  messages: ChatMessage[] = [
  ];

  addMessage(message: ChatResponse, from: From) {
    this.messages.push({ message, from, date: new Date(), id: randomId() });
    this.loading = false;
  }

  ask(question: string) {
    this.loading = true;
    this.messages.push({
      message: question,
      from: "user",
      date: new Date(),
      id: randomId(),
    });
  }
}

export const chatService = new ChatService();

function randomId() {
  return Math.random().toString(16);
}
