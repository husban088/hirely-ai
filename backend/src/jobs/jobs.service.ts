import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { JobApplication, JobApplicationDocument } from "./job.schema";
import { CreateJobInput, UpdateJobInput } from "./dto/job.input";

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(JobApplication.name)
    private jobModel: Model<JobApplicationDocument>,
  ) {}

  async create(userId: string, input: CreateJobInput) {
    const job = new this.jobModel({
      ...input,
      userId: new Types.ObjectId(userId),
      appliedDate: input.status === "APPLIED" ? new Date() : undefined,
    });
    return job.save();
  }

  async findAllForUser(userId: string) {
    return this.jobModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 });
  }

  async update(userId: string, input: UpdateJobInput) {
    const job = await this.findOwned(userId, input.id);
    const { id, ...updates } = input;
    Object.assign(job, updates);
    if (input.status === "APPLIED" && !job.appliedDate)
      job.appliedDate = new Date();
    return job.save();
  }

  async remove(userId: string, id: string) {
    const job = await this.findOwned(userId, id);
    await job.deleteOne();
    return true;
  }

  private async findOwned(userId: string, id: string) {
    const job = await this.jobModel.findById(id);
    if (!job) throw new NotFoundException("Job application not found.");
    if (job.userId.toString() !== userId)
      throw new ForbiddenException("Not your job application.");
    return job;
  }
}
