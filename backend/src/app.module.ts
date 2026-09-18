import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MongooseModule } from "@nestjs/mongoose";
import { join } from "path";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ResumeModule } from "./resume/resume.module";
import { JobsModule } from "./jobs/jobs.module";
import { OpenAiModule } from "./openai/openai.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";

// On Vercel (and any production host with a read-only filesystem) we must NOT write
// src/schema.gql at startup — that crashes the function. Build the schema in memory instead.
const isReadOnlyFs =
  !!process.env.VERCEL || process.env.NODE_ENV === "production";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || "mongodb://localhost:27017/hirely-ai",
      {
        serverSelectionTimeoutMS: 10000,
        retryAttempts: 3,
        retryDelay: 1000,
      },
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: isReadOnlyFs
        ? true
        : join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      context: ({ req }) => ({ req }),
      playground: true,
      introspection: true,
    }),
    AuthModule,
    UsersModule,
    ResumeModule,
    JobsModule,
    OpenAiModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
