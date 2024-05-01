import { QdrantClient } from "@qdrant/js-client-rest";
import { v4 as uuid } from "uuid";

const QDRANT_INSERT_CHUNK_SIZE = 500;

export interface Hit {
  pageContent: string;
  source: string;
  score: number;
}

export class QdrantDb {
  client: QdrantClient;
  clusterName: string;

  constructor() {
    const url = process.env.QDRANT_URL || "http://localhost:6333";
    const clusterName = process.env.QDRANT_CLUSTER_NAME || "provette";
    this.client = new QdrantClient({ url });
    this.clusterName = clusterName;
  }

  async init({ dimensions }) {
    const collectionExists = await this.client.collectionExists(
      this.clusterName,
    );
    console.log("Collection exists", collectionExists);
    if (collectionExists.exists) {
      return;
    }

    await this.client.createCollection(this.clusterName, {
      vectors: {
        size: dimensions,
        distance: "Cosine",
      },
    });
    console.log("Collection created");

    await this.client.createPayloadIndex(this.clusterName, {
      wait: true,
      field_name: "uniqueLoaderId",
      field_schema: "text",
      ordering: "weak",
    });
  }

  async insertChunks(
    chunks: { vector: number[]; text: string; index: number }[],
    metadata: { source: string },
  ) {
    let processed = 0;
    for (let i = 0; i < chunks.length; i += QDRANT_INSERT_CHUNK_SIZE) {
      const chunkBatch = chunks.slice(i, i + QDRANT_INSERT_CHUNK_SIZE);

      const upsertCommand = chunkBatch.map((chunk) => {
        return {
          id: uuid(),
          vector: chunk.vector,
          payload: { text: chunk.text, ...metadata },
          // payload: { pageContent: chunk.pageContent, ...chunk.metadata },
        };
      });

      await this.client.upsert(this.clusterName, {
        wait: true,
        points: upsertCommand,
      });
      processed += chunkBatch.length;
    }

    return processed;
  }

  async similaritySearch(query: number[], limit: number): Promise<Hit[]> {
    const queryResponse = await this.client.search(this.clusterName, {
      limit: limit,
      vector: query,
      with_payload: true,
      score_threshold: 0.4,
    });

    return queryResponse.map((match) => {
      const pageContent = match.payload.text as string;
      delete match.payload.text;
      console.log("MATCH", match.payload);
      return {
        pageContent,
        source: match.payload.source as string,
        score: match.score,
      };
    });
  }
}
