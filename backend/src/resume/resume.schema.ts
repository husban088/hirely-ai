import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

export type ResumeDocument = Resume & Document;

@ObjectType()
export class ResumeAnalysis {
  @Field(() => Int, { nullable: true })
  score?: number;

  @Field({ nullable: true })
  summary?: string;

  @Field(() => [String], { nullable: true })
  strengths?: string[];

  @Field(() => [String], { nullable: true })
  weaknesses?: string[];

  @Field(() => [String], { nullable: true })
  atsIssues?: string[];

  @Field(() => [String], { nullable: true })
  keywordGaps?: string[];
}

@ObjectType()
@Schema({ timestamps: true })
export class Resume {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  fileName: string;

  @Field()
  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  publicId: string;

  @Field()
  @Prop({ required: true })
  extractedText: string;

  @Field({ nullable: true })
  @Prop()
  optimizedText?: string;

  @Field(() => ResumeAnalysis, { nullable: true })
  @Prop({ type: Object })
  analysis?: ResumeAnalysis;

  @Field()
  @Prop({ default: "US" })
  targetMarket: string;

  @Field()
  @Prop({ default: "" })
  targetRole: string;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
