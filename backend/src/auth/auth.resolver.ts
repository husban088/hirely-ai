import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthPayload, SimpleMessage } from "./auth.types";
import { RegisterInput } from "./dto/register.input";
import { LoginInput } from "./dto/login.input";
import { ForgotPasswordInput } from "./dto/forgot-password.input";
import { ResetPasswordInput } from "./dto/reset-password.input";
import { GqlAuthGuard } from "./gql-auth.guard";
import { CurrentUser } from "./current-user.decorator";
import { User } from "../users/user.schema";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async register(@Args("input") input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthPayload)
  async login(@Args("input") input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => SimpleMessage)
  async forgotPassword(@Args("input") input: ForgotPasswordInput) {
    return this.authService.forgotPassword(input);
  }

  @Mutation(() => SimpleMessage)
  async resetPassword(@Args("input") input: ResetPasswordInput) {
    return this.authService.resetPassword(input);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }
}
