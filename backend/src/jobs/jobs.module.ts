import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobApplication, JobApplicationSchema } from './job.schema';
import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: JobApplication.name, schema: JobApplicationSchema }])],
  providers: [JobsService, JobsResolver],
})
export class JobsModule {}
