import { Module } from "@nestjs/common";
import { EventsModule } from "./events/events.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ConfigModule } from "@nestjs/config";
import { UploadModule } from "./upload/upload.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventsModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client"),
    }),
  ],
  controllers: [],
})
export class AppModule {}
