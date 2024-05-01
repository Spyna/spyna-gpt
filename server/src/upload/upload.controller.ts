import {
  FileFieldsInterceptor,
  MemoryStorageFile,
  UploadedFiles,
} from "@blazity/nest-file-fastify";
import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";

import { EmbedderService } from "src/embedder/embedder.service";

@Controller("")
export class UploadController {
  constructor(private readonly embedderService: EmbedderService) {}

  @Post("/upload")
  @UseInterceptors(FileFieldsInterceptor([{ name: "file", maxCount: 10 }]))
  async register(
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
}
