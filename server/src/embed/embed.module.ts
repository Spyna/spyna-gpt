import { Module } from "@nestjs/common";
import { PdfService } from "src/embedder/pdf.service";
import { OpenAiClient } from "src/events/openai.client";
import { QdrantDb } from "src/events/qdrant.client";
import { EmbedController } from "./embed.controller";
import { EmbedderService } from "src/embedder/embedder.service";
import { EventsGateway } from "src/events/events.gateway";
import { EventsService } from "src/events/events.service";
import { ScrapingService } from "src/embedder/scraping.service";

@Module({
  controllers: [EmbedController],
  providers: [
    EmbedderService,
    PdfService,
    OpenAiClient,
    QdrantDb,
    EventsGateway,
    EventsService,
    ScrapingService,
  ],
})
export class UploadModule {}
