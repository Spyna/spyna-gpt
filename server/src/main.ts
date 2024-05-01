import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import multiPart from "@fastify/multipart";
import { AppModule } from "./app.module";
import { RedisIoAdapter } from "./adapters/redis-io.adapter";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Uncomment these lines to use the Redis adapter:
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.enableCors({
    origin: "*",
  });
  app.useWebSocketAdapter(redisIoAdapter);
  await app.register(multiPart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 1000000000,
      fields: 10,
      fileSize: 1000000000,
      files: 10,
      headerPairs: 2000,
    },
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
