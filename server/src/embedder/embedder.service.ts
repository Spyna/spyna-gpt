import { Injectable } from "@nestjs/common";
import { PdfService } from "./pdf.service";
import { QdrantDb } from "src/events/qdrant.client";
import {
  OPENAI_EMBEDDING_DIMENSIONS,
  OpenAiClient,
} from "src/events/openai.client";
import { EventsGateway } from "src/events/events.gateway";
import { splitText } from "src/utils/textUtils";

@Injectable()
export class EmbedderService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly qdrantDb: QdrantDb,
    private readonly openai: OpenAiClient,
    private readonly socketGateway: EventsGateway,
  ) {}
  async processText(text: string, title: string) {
    const chunks = await splitText(text);
    console.log("Processing text", title);
    await this.embed(chunks, title);
  }

  async processFile(buffer: Buffer, fileName: string) {
    console.log("Processing file", fileName);
    const chunks = await this.pdfService.parsePdf(buffer);
    await this.embed(chunks, fileName);
  }

  async embed(chunks: string[], fileName: string) {
    await this.qdrantDb.init({ dimensions: OPENAI_EMBEDDING_DIMENSIONS });
    const toIndex = [];

    for (let index = 0; index < chunks.length; index++) {
      const chunk = chunks[index];
      console.log(
        "Processing chunk of file",
        `[${fileName}]`,
        index + 1 + "/" + chunks.length,
      );
      if (chunks.length > 100 && index % 100 === 0 && index > 0) {
        this.socketGateway.emit(
          "embedding",
          `${fileName} embedding progress: ${index + 1}/${chunks.length} chunks processed`,
        );
      }

      const embed = await this.openai.embed(chunk, "text-embedding-3-small");

      toIndex.push({ vector: embed, chunk: index, text: chunk });
    }
    await this.qdrantDb.insertChunks(toIndex, {
      source: fileName,
    });
    console.log("File embedded succesfully", fileName);
    this.socketGateway.emit("embedding", `${fileName} succesfully embedded`);
  }
}
