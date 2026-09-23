import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CoverLetterInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  resumeId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  jobDescription: string;
}
