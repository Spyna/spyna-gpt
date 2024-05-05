import OpenAI from "openai";
import { EmbeddingCreateParams } from "openai/resources";
import { Hit } from "./qdrant.client";
import { Stream } from "openai/streaming";

export const OPENAI_EMBEDDING_DIMENSIONS = 1536;

export class OpenAiClient {
  openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env["OPENAI_API_KEY"],
    });
  }

  async embed(
    toEmbed: string,
    model: EmbeddingCreateParams["model"],
    dimensions: number = OPENAI_EMBEDDING_DIMENSIONS,
  ): Promise<number[]> {
    const embedding = await this.openai.embeddings.create({
      model: model,
      input: toEmbed,
      dimensions,
      encoding_format: "float",
    });
    return embedding.data[0].embedding;
  }

  async chat(
    userQuestion: string,
    hits: Hit[],
  ): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    const aiContext = createSystemContext();

    const stream = await this.openai.chat.completions.create({
      messages: [
        { role: "system", content: aiContext },
        {
          role: "assistant",
          content: createAssistantContext(
            hits.map((hit) => hit.pageContent).join("\n\n"),
          ),
        },
        { role: "user", content: userQuestion },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.4,
      stream: true,
    });
    return stream;
  }
}

function createAssistantContext(context: string) {
  return context;
}

function createSystemContext() {
  return `You are a helpful human like chat bot called Spina GPT. Use all the provided context to answer the query at the end. Answer in full.
If you don't know the answer, just say that you don't know, don't try to make up an answer. 

Do not use words like context or training data when responding. You can say you may not have all the information but do not say that you are not a reliable source.

If you feel it necessary, divide the text into chapters and make bulleted or numbered lists.
Respond in markdown.
`;
}
