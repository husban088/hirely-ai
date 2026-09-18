import "dotenv/config"; // MUST be the very first import — loads .env before any other file reads process.env
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as express from "express";
import { graphqlUploadExpress } from "graphql-upload";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 1 }),
  );
  app.use(express.json({ limit: "10mb" }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(
    `🚀 Hirely AI backend running on http://localhost:${port}/graphql`,
  );
}
bootstrap();
