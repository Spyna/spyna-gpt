import {
  FileFieldsInterceptor,
  MemoryStorageFile,
  UploadedFiles,
} from "@blazity/nest-file-fastify";
import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";

import { EmbedderService } from "src/embedder/embedder.service";
import { ScrapingService } from "src/embedder/scraping.service";

class TextEmbedRequest {
  title: string;
  text: string;
}
class UrlEmbedRequest {
  url: string;
}

@Controller("/upload")
export class UploadController {
  constructor(
    private readonly embedderService: EmbedderService,
    private readonly scraper: ScrapingService,
  ) {}

  @Post("/pdf")
  @UseInterceptors(FileFieldsInterceptor([{ name: "file", maxCount: 10 }]))
  async embedPdf(
    @Body() data: Record<string, unknown>, // other data that you might want to pass along with the files
    @UploadedFiles()
    uploads: { file?: MemoryStorageFile[]; filename?: string[] },
  ): Promise<void> {
    const files = uploads.file;

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const fileName = data["name" + index] as string;
      console.log("Processing file", fileName);
      this.embedderService.processFile(file.buffer, fileName);
      //TODO handle case when file processing fails
      console.log("File processed", fileName);
    }
  }

  @Post("/text")
  async embedText(@Body() request: TextEmbedRequest): Promise<void> {
    this.embedderService.processText(request.text, request.title);
  }

  @Post("/url")
  async embedWebsite(@Body() request: UrlEmbedRequest): Promise<void> {
    const { text, link } = await this.scraper.scrape(request.url);
    this.embedderService.processText(text, request.url);

    console.log("Links found", link);
    for (const path of link) {
      const { text } = await this.scraper.scrape(request.url + path);
      this.embedderService.processText(text, request.url + path);
    }
  }
}
