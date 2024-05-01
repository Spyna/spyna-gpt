import { Injectable } from "@nestjs/common";
import { OpenAiClient } from "src/events/openai.client";
import { QdrantDb } from "src/events/qdrant.client";
import { splitText } from "src/utils/textSplitter";
import * as PdfParse from "pdf-parse";

@Injectable()
export class PdfService {
  async parsePdf(pdfBuffer: Buffer): Promise<string[]> {
    const pdf = await PdfParse(pdfBuffer, {});

    return await splitText(cleanString(pdf.text));
  }
}

function cleanString(text: string) {
  text = text.replace(/\\/g, "");
  text = text.replace(/#/g, " ");
  text = text.replace(/\. \./g, ".");
  text = text.replace(/\s\s+/g, " ");
  text = text.replace(/(\r\n|\n|\r)/gm, " ");

  return text.trim();
}
