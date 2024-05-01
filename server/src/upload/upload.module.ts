import { Module } from "@nestjs/common";
import { PdfService } from "src/embedder/pdf.service";
import { OpenAiClient } from "src/events/openai.client";
import { QdrantDb } from "src/events/qdrant.client";
import { UploadController } from "./upload.controller";
import { EmbedderService } from "src/embedder/embedder.service";
import { EventsGateway } from "src/events/events.gateway";
import { EventsService } from "src/events/events.service";

@Module({
  controllers: [UploadController],
  providers: [
    EmbedderService,
    PdfService,
    OpenAiClient,
    QdrantDb,
    EventsGateway,
    EventsService,
  ],
})
export class UploadModule {}