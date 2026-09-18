import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { JobStatus } from '../job.schema';

@InputType()
export class CreateJobInput {
  @Field()
  @IsNotEmpty()
  jobTitle: string;

  @Field()
  @IsNotEmpty()
  companyName: string;

  @Field({ nullable: true })
  companyLogoUrl?: string;

  @Field({ nullable: true })
  jobUrl?: string;

  @Field({ nullable: true })
  location?: string;

  @Field(() => JobStatus, { nullable: true })
  status?: JobStatus;

  @Field({ nullable: true })
  notes?: string;
}

@InputType()
export class UpdateJobInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field({ nullable: true })
  companyName?: string;

  @Field({ nullable: true })
  companyLogoUrl?: string;

  @Field({ nullable: true })
  jobUrl?: string;

  @Field({ nullable: true })
  location?: string;

  @Field(() => JobStatus, { nullable: true })
  status?: JobStatus;

  @Field({ nullable: true })
  notes?: string;
}
