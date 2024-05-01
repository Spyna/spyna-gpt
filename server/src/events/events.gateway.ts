import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Observable } from "rxjs";
import { Server } from "socket.io";
import { ChatResponse, EventsService } from "./events.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class EventsGateway {
  constructor(private readonly eventService: EventsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage("events")
  async onChatMessageReceived(
    @MessageBody() data: any,
  ): Promise<Observable<WsResponse<ChatResponse>>> {
    const chatResponse = await this.eventService.onchatMessage(data);
    return new Observable<WsResponse<ChatResponse>>((observer) => {
      observer.next({ event: "events", data: chatResponse });
      observer.complete();
    });
  }

  @SubscribeMessage("identity")
  async identity(@MessageBody() data: number): Promise<number> {
    console.log("identity", data);
    return data;
  }

  emit(eventType: string, data: any) {
    console.log("emitting this event", eventType, data);
    this.server.emit(eventType, data);
  }
}
