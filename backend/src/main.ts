import "dotenv/config"; // MUST be the very first import — loads .env before any other file reads process.env
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as express from "express";
import { graphqlUploadExpress } from "graphql-upload";

// FRONTEND_URL can hold one origin or several comma-separated ones, e.g.
// "https://my-app.vercel.app,http://localhost:3000"  (no trailing slash needed)
function getAllowedOrigins(): string[] {
  const raw = process.env.FRONTEND_URL || "http://localhost:3000";
  return raw
    .split(",")
    .map((o) => o.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = getAllowedOrigins();
  app.enableCors({
    origin: (origin, callback) => {
      // No Origin header (curl, server-to-server, same-origin) => allow.
      if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
        return callback(null, true);
      }
      console.warn(
        `[CORS] blocked origin: ${origin} | allowed: ${allowedOrigins.join(", ")}`,
      );
      return callback(null, false);
    },
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
