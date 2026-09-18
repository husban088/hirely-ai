import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ObjectType, Field, ID, registerEnumType } from "@nestjs/graphql";

export enum JobStatus {
  WISHLIST = "WISHLIST",
  APPLIED = "APPLIED",
  INTERVIEW = "INTERVIEW",
  OFFER = "OFFER",
  REJECTED = "REJECTED",
}

registerEnumType(JobStatus, { name: "JobStatus" });

export type JobApplicationDocument = JobApplication & Document;

@ObjectType()
@Schema({ timestamps: true })
export class JobApplication {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  jobTitle: string;

  @Field()
  @Prop({ required: true })
  companyName: string;

  @Field({ nullable: true })
  @Prop()
  companyLogoUrl?: string;

  @Field({ nullable: true })
  @Prop()
  jobUrl?: string;

  @Field({ nullable: true })
  @Prop()
  location?: string;

  @Field(() => JobStatus)
  @Prop({ type: String, enum: JobStatus, default: JobStatus.WISHLIST })
  status: JobStatus;

  @Field({ nullable: true })
  @Prop()
  notes?: string;

  @Field({ nullable: true })
  @Prop()
  appliedDate?: Date;

  @Field({ nullable: true })
  @Prop()
  resumeId?: string;
}

export const JobApplicationSchema =
  SchemaFactory.createForClass(JobApplication);
