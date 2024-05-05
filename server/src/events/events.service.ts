import { Injectable } from "@nestjs/common";
import { QdrantDb } from "./qdrant.client";
import { OpenAiClient } from "./openai.client";
import { ChatQuestion } from "src/model/ChatQuestion";
import { Stream } from "openai/streaming";
import OpenAI from "openai";

interface StreamResponse {
  stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>;
  sources: string[];
}

@Injectable()
export class EventsService {
  constructor(
    private readonly qdrant: QdrantDb,
    private readonly openai: OpenAiClient,
  ) {}

  async onchatMessage(data: ChatQuestion): Promise<StreamResponse> {
    const query = data.query;
    const qdrantResults = await this.qdrant.similaritySearch(
      await this.openai.embed(query, "text-embedding-3-small"),
      7,
    );
    console.log(
      "qdrant results scores",
      qdrantResults.map(
        (r) =>
          r.source +
          ": " +
          r.score +
          ": " +
          r.pageContent.substring(0, 50) +
          "...",
      ),
    );

    const sources = [...new Set(qdrantResults.map((r) => r.source))];
    return { stream: await this.openai.chat(query, qdrantResults), sources };
  }

  async embed(data: any): Promise<number[]> {
    return await this.openai.embed(data, "text-embedding-3-");
  }
}
