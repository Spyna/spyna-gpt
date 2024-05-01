import OpenAI from "openai";
import { EmbeddingCreateParams } from "openai/resources";
import { Hit } from "./qdrant.client";

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

  async chat(userQuestion: string, hits: Hit[]): Promise<string> {
    const aiContext = createSystemContext();
    // console.log("AI CONTEXT", hits);

    const chatCompletion = await this.openai.chat.completions.create({
      messages: [
        { role: "system", content: aiContext },
        {
          role: "assistant",
          content: createAssistantContext(
            hits.map((hit) => "```\n" + hit.pageContent + "\n```").join("\n"),
          ),
        },
        { role: "user", content: userQuestion },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.5,
    });

    // console.log("OPENAI RESPONSE", JSON.stringify(chatCompletion, null, 2));
    return chatCompletion.choices[0].message.content;
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
