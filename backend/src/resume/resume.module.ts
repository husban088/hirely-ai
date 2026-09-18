import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './resume.schema';
import { ResumeService } from './resume.service';
import { ResumeResolver } from './resume.resolver';
import { ResumeController } from './resume.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { OpenAiModule } from '../openai/openai.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
    CloudinaryModule,
    OpenAiModule,
  ],
  providers: [ResumeService, ResumeResolver],
  controllers: [ResumeController],
})
export class ResumeModule {}
