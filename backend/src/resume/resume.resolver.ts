import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ResumeService } from './resume.service';
import { Resume } from './resume.schema';
import { User } from '../users/user.schema';
import { CoverLetterInput } from './dto/cover-letter.input';

@Resolver(() => Resume)
@UseGuards(GqlAuthGuard)
export class ResumeResolver {
  constructor(private resumeService: ResumeService) {}

  @Query(() => [Resume])
  async myResumes(@CurrentUser() user: User) {
    return this.resumeService.findAllForUser((user as any)._id.toString());
  }

  @Mutation(() => Resume)
  async optimizeResume(@CurrentUser() user: User, @Args('resumeId') resumeId: string) {
    return this.resumeService.optimize((user as any)._id.toString(), resumeId);
  }

  @Mutation(() => String)
  async generateCoverLetter(@CurrentUser() user: User, @Args('input') input: CoverLetterInput) {
    return this.resumeService.generateCoverLetter(
      (user as any)._id.toString(),
      input.resumeId,
      input.jobTitle,
      input.companyName,
      input.jobDescription,
    );
  }

  @Mutation(() => Boolean)
  async deleteResume(@CurrentUser() user: User, @Args('resumeId') resumeId: string) {
    return this.resumeService.remove((user as any)._id.toString(), resumeId);
  }
}
