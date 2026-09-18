import "dotenv/config"; // MUST be the very first import — loads .env before any other file reads process.env
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as express from "express";
import { graphqlUploadExpress } from "graphql-upload";

/**
 * CORS allow-list:
 *  - every origin in FRONTEND_URL (comma-separated, trailing slash ignored)
 *  - localhost / 127.0.0.1 on any port (local development)
 *  - any https://*.vercel.app origin (production + preview deployments of the frontend)
 * Auth uses a Bearer token (not cookies), so allowing Vercel preview URLs is safe.
 */
function isOriginAllowed(origin?: string): boolean {
  if (!origin) return true; // curl / server-to-server / same-origin requests
  const o = origin.replace(/\/+$/, "");

  const configured = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  if (configured.includes(o)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(o)) return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(o)) return true;
  return false;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => callback(null, isOriginAllowed(origin)),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Apollo-Require-Preflight",
    ],
    credentials: true,
    maxAge: 86400,
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

  // Simple health check — open the backend URL in a browser to confirm it is alive.
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get("/", (_req: any, res: any) =>
    res.json({
      status: "ok",
      service: "hirely-ai-backend",
      graphql: "/graphql",
    }),
  );
  httpAdapter.get("/health", (_req: any, res: any) =>
    res.json({ status: "ok" }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(
    `🚀 Hirely AI backend running on http://localhost:${port}/graphql`,
  );
}
bootstrap();
