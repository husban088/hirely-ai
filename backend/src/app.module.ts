import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ResumeModule } from "./resume/resume.module";
import { JobsModule } from "./jobs/jobs.module";
import { OpenAiModule } from "./openai/openai.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || "mongodb://localhost:27017/hirely-ai",
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // keep schema in memory (Vercel's filesystem is read-only)
      sortSchema: true,
      context: ({ req }) => ({ req }),
      playground: true,
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
