import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JobsService } from './jobs.service';
import { JobApplication } from './job.schema';
import { CreateJobInput, UpdateJobInput } from './dto/job.input';
import { User } from '../users/user.schema';

@Resolver(() => JobApplication)
@UseGuards(GqlAuthGuard)
export class JobsResolver {
  constructor(private jobsService: JobsService) {}

  @Query(() => [JobApplication])
  async myJobs(@CurrentUser() user: User) {
    return this.jobsService.findAllForUser((user as any)._id.toString());
  }

  @Mutation(() => JobApplication)
  async createJob(@CurrentUser() user: User, @Args('input') input: CreateJobInput) {
    return this.jobsService.create((user as any)._id.toString(), input);
  }

  @Mutation(() => JobApplication)
  async updateJob(@CurrentUser() user: User, @Args('input') input: UpdateJobInput) {
    return this.jobsService.update((user as any)._id.toString(), input);
  }

  @Mutation(() => Boolean)
  async deleteJob(@CurrentUser() user: User, @Args('id') id: string) {
    return this.jobsService.remove((user as any)._id.toString(), id);
  }
}
