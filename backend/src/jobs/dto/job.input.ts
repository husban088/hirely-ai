import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString, IsEnum } from "class-validator";
import { JobStatus } from "../job.schema";

// IMPORTANT: the app's global ValidationPipe uses `whitelist: true`, which makes
// class-validator strip out any field that has NO class-validator decorator on it
// (a GraphQL @Field() alone does not count). Every field below needs at least
// @IsOptional()/@IsNotEmpty() etc., or it gets silently deleted before it ever
// reaches the resolver — which is exactly what was breaking drag-and-drop
// (the "id" and "status" fields were being wiped out of every updateJob call).

@InputType()
export class CreateJobInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  companyLogoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  jobUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @Field(() => JobStatus, { nullable: true })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}

@InputType()
export class UpdateJobInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  companyName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  companyLogoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  jobUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @Field(() => JobStatus, { nullable: true })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
