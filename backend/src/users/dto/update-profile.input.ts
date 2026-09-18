import { InputType, Field } from "@nestjs/graphql";
import { IsOptional, IsNotEmpty, IsUrl } from "class-validator";

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  fullName?: string;

  @Field({ nullable: true })
  @IsOptional()
  targetRole?: string;

  @Field({ nullable: true })
  @IsOptional()
  targetMarket?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
