import { Injectable } from "@nestjs/common";
import { PdfService } from "./pdf.service";
import { QdrantDb } from "src/events/qdrant.client";
import {
  OPENAI_EMBEDDING_DIMENSIONS,
  OpenAiClient,
} from "src/events/openai.client";
import { EventsGateway } from "src/events/events.gateway";

@Injectable()
export class EmbedderService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly qdrantDb: QdrantDb,
    private readonly openai: OpenAiClient,
    private readonly socketGateway: EventsGateway,
  ) {}

  async processFile(buffer: Buffer, fileName: string) {
    await this.qdrantDb.init({ dimensions: OPENAI_EMBEDDING_DIMENSIONS });

    const chunks = await this.pdfService.parsePdf(buffer);
    const toIndex = [];
    // for (let index = 0; index < chunks.length; index++) {
    for (let index = 0; index < 2; index++) {
      const chunk = chunks[index];
      console.log("Processing chunk", index + 1 + "/" + chunks.length);

      const embed = await this.openai.embed(chunk, "text-embedding-3-large");

      toIndex.push({ vector: embed, chunk: index, text: chunk });
    }
    await this.qdrantDb.insertChunks(toIndex, {
      source: fileName,
    });
    console.log("File embedded succesfully", fileName);
    this.socketGateway.emit("embedding", fileName);
  }
}
