import { Module } from "@nestjs/common";
import { EventsGateway } from "./events.gateway";
import { EventsService } from "./events.service";
import { OpenAiClient } from "./openai.client";
import { QdrantDb } from "./qdrant.client";

@Module({
  providers: [EventsGateway, EventsService, OpenAiClient, QdrantDb],
})
export class EventsModule {}
