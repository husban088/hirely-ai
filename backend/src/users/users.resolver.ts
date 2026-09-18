import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { UsersService } from "./users.service";
import { UpdateProfileInput } from "./dto/update-profile.input";
import { User } from "./user.schema";

@Resolver()
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => User)
  async updateProfile(
    @CurrentUser() user: User,
    @Args("input") input: UpdateProfileInput,
  ) {
    return this.usersService.update((user as any)._id.toString(), input);
  }

  @Mutation(() => Boolean)
  async deleteAccount(@CurrentUser() user: User) {
    return this.usersService.deleteAccount((user as any)._id.toString());
  }
}
