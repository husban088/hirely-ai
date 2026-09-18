import { ObjectType, Field } from "@nestjs/graphql";
import { User } from "../users/user.schema";

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class SimpleMessage {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
