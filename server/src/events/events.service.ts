import { Injectable } from "@nestjs/common";
import { QdrantDb } from "./qdrant.client";
import { OpenAiClient } from "./openai.client";

export interface ChatResponse {
  content: string;
  sources: string[];
}

@Injectable()
export class EventsService {
  constructor(
    private readonly qdrant: QdrantDb,
    private readonly openai: OpenAiClient,
  ) {}

  async onchatMessage(data: any): Promise<ChatResponse> {
    const query = data.test;
    const qdrantResults = await this.qdrant.similaritySearch(
      await this.openai.embed(query, "text-embedding-3-large"),
      5,
    );
    console.log(
      "QDRANT RESULTS",
      qdrantResults.map((r) => r.score),
    );

    const chatResponse = await this.openai.chat(query, qdrantResults);
    const sources = [...new Set(qdrantResults.map((r) => r.source))];

    return { content: chatResponse, sources };
  }

  async embed(data: any): Promise<number[]> {
    return await this.openai.embed(data, "text-embedding-3-");
  }
}
