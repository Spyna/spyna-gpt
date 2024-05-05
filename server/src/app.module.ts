import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { UploadModule } from "./embed/embed.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client"),
    }),
  ],
  controllers: [],
})
export class AppModule {}
