import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ObjectType, Field, ID } from "@nestjs/graphql";

export type UserDocument = User & Document;

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field()
  @Prop({ required: true })
  fullName: string;

  @Field({ nullable: true })
  @Prop()
  avatarUrl?: string;

  @Field({ nullable: true })
  @Prop()
  targetRole?: string;

  @Field({ nullable: true })
  @Prop({ default: "US" })
  targetMarket?: string; // e.g. US, Germany, UK

  // Populated automatically by { timestamps: true } above — exposing it here
  // just lets GraphQL read it back out (e.g. for a "member since" display).
  @Field({ nullable: true })
  createdAt?: Date;

  // Internal only — never exposed via @Field, so it never reaches GraphQL responses.
  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
