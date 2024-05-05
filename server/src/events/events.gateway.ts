import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Server } from "socket.io";
import { EventsService } from "./events.service";
import { ChatQuestion } from "src/model/ChatQuestion";

export interface ChatResponse {
  content: string;
  sources: string[];
}

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
    const response = await this.eventService.onchatMessage(data);
    return from(response.stream).pipe(
      map((data) => ({
        event: "events",
        data: {
          id: data.id,
          finished: data.choices[0]?.finish_reason === "stop",
          content: data.choices[0]?.delta?.content || "",
          sources: response.sources,
        },
      })),
    );
  }

  emit(eventType: string, data: any) {
    console.log("emitting this event", eventType, data);
    this.server.emit(eventType, data);
  }
}
