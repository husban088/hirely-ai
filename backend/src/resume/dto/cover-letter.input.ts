import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CoverLetterInput {
  @Field()
  resumeId: string;

  @Field()
  @IsNotEmpty()
  jobTitle: string;

  @Field()
  @IsNotEmpty()
  companyName: string;

  @Field()
  jobDescription: string;
}
