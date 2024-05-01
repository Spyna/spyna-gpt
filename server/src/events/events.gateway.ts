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
import { ChatQuestion } from "src/model/ChatQuestion";

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
    @MessageBody() data: ChatQuestion,
  ): Promise<Observable<WsResponse<ChatResponse>>> {
    console.log("Received chat message", data);
    const chatResponse = await this.eventService.onchatMessage(data);
    return new Observable<WsResponse<ChatResponse>>((observer) => {
      observer.next({ event: "events", data: chatResponse });
      observer.complete();
    });
  }

  emit(eventType: string, data: any) {
    console.log("emitting this event", eventType, data);
    this.server.emit(eventType, data);
  }
}
