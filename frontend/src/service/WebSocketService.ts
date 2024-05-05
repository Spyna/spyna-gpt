import { makeAutoObservable } from "mobx";
import { socket } from "./socketClient";

export type EventType = "events" | "embedding";

export const Events: { [key: string]: EventType } = {
  events: "events",
  embedding: "embedding",
};

class WebSocketService {
  socket;
  connected = false;

  constructor() {
    this.socket = socket;
    makeAutoObservable(this);
  }

  setConnected(value: boolean) {
    this.connected = value;
  }

  emit(event: EventType, data: { query: string }) {
    this.socket.timeout(5000).emit(event, data);
  }
}

export const webSocketService = new WebSocketService();
