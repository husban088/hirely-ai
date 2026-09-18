import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { Resume, ResumeSchema } from "../resume/resume.schema";
import { JobApplication, JobApplicationSchema } from "../jobs/job.schema";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Resume.name, schema: ResumeSchema },
      { name: JobApplication.name, schema: JobApplicationSchema },
    ]),
  ],
  providers: [UsersService, UsersResolver],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
