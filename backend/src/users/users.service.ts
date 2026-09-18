import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { Resume, ResumeDocument } from "../resume/resume.schema";
import { JobApplication, JobApplicationDocument } from "../jobs/job.schema";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Resume.name) private resumeModel: Model<ResumeDocument>,
    @InjectModel(JobApplication.name)
    private jobModel: Model<JobApplicationDocument>,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async findByResetToken(hashedToken: string) {
    return this.userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async create(data: Partial<User>) {
    const created = new this.userModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  // Deletes the user's account along with every resume and job application
  // they own, so nothing orphaned is left behind in MongoDB.
  async deleteAccount(id: string) {
    await this.resumeModel.deleteMany({ userId: id });
    await this.jobModel.deleteMany({ userId: id });
    await this.userModel.findByIdAndDelete(id);
    return true;
  }
}
