import { Injectable } from "@nestjs/common";
import { splitText } from "src/utils/textUtils";
import * as PdfParse from "pdf-parse";

@Injectable()
export class PdfService {
  async parsePdf(pdfBuffer: Buffer): Promise<string[]> {
    const pdf = await PdfParse(pdfBuffer, {});

    return await splitText(pdf.text);
  }
}
