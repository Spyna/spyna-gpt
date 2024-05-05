import { Module } from "@nestjs/common";
import { PdfService } from "src/embed/pdf.service";
import { OpenAiClient } from "src/events/openai.client";
import { QdrantDb } from "src/events/qdrant.client";
import { EmbedController } from "./embed.controller";
import { EventsGateway } from "src/events/events.gateway";
import { EventsService } from "src/events/events.service";
import { EmbedService } from "./embed.service";
import { ScrapingService } from "./scraping.service";

@Module({
  controllers: [EmbedController],
  providers: [
    EmbedService,
    PdfService,
    OpenAiClient,
    QdrantDb,
    EventsGateway,
    EventsService,
    ScrapingService,
  ],
})
export class UploadModule {}
