import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Resume, ResumeDocument } from "./resume.schema";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { OpenAiService } from "../openai/openai.service";
import { extractTextFromBuffer } from "./text-extractor";

const CLOUDINARY_TIMEOUT_MS = 20000;

/** Races any promise against a timeout so a stalled network call can never hang forever. */
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name) private resumeModel: Model<ResumeDocument>,
    private cloudinaryService: CloudinaryService,
    private openAiService: OpenAiService,
  ) {}

  async uploadAndAnalyze(
    userId: string,
    file: { buffer: Buffer; originalname: string },
    targetRole: string,
    targetMarket: string,
  ) {
    let extractedText: string;
    try {
      extractedText = await extractTextFromBuffer(
        file.buffer,
        file.originalname,
      );
    } catch (err: any) {
      console.error(
        "[ResumeService] Text extraction failed:",
        err?.message || err,
      );
      throw new BadRequestException(
        `Could not read that file: ${err?.message || "unknown error"}`,
      );
    }

    console.log(
      "[ResumeService] Text extracted, starting upload + AI scoring in parallel...",
    );

    // Cloudinary upload and Gemini scoring don't depend on each other —
    // run them together instead of one after the other. Both are wrapped
    // in a timeout so a stalled network call can never hang the request
    // forever (this was the actual bug behind "stuck at 95%").
    const [uploaded, analysis] = await Promise.all([
      withTimeout(
        this.cloudinaryService.uploadBuffer(file.buffer, {
          folder: `hirely-ai/resumes/${userId}`,
          resourceType: "raw",
        }),
        CLOUDINARY_TIMEOUT_MS,
        "Cloudinary upload",
      ).catch((err: any) => {
        console.error(
          "[ResumeService] Cloudinary upload failed:",
          err?.message || err,
        );
        throw new BadRequestException(
          `File storage failed: ${err?.message || "unknown error"}`,
        );
      }),
      this.openAiService
        .scoreResume(extractedText, targetRole, targetMarket)
        .catch((err: any) => {
          console.error(
            "[ResumeService] AI scoring failed:",
            err?.message || err,
          );
          throw new BadRequestException(err?.message || "AI analysis failed.");
        }),
    ]);

    console.log(
      "[ResumeService] Upload + AI scoring both done, saving resume...",
    );

    const resume = new this.resumeModel({
      userId: new Types.ObjectId(userId),
      fileName: file.originalname,
      fileUrl: uploaded.url,
      publicId: uploaded.publicId,
      extractedText,
      analysis,
      targetRole,
      targetMarket,
    });

    return resume.save();
  }

  async optimize(userId: string, resumeId: string) {
    const resume = await this.findOwned(userId, resumeId);
    const result = await this.openAiService.optimizeResume(
      resume.extractedText,
      resume.targetRole,
      resume.targetMarket,
    );
    resume.optimizedText = result.optimizedText || result.raw || "";
    return resume.save();
  }

  async generateCoverLetter(
    userId: string,
    resumeId: string,
    jobTitle: string,
    companyName: string,
    jobDescription: string,
  ) {
    const resume = await this.findOwned(userId, resumeId);
    return this.openAiService.generateCoverLetter(
      resume.extractedText,
      jobTitle,
      companyName,
      jobDescription,
      resume.targetMarket,
    );
  }

  async findAllForUser(userId: string) {
    return this.resumeModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });
  }

  async findOwned(userId: string, resumeId: string) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) throw new NotFoundException("Resume not found.");
    if (resume.userId.toString() !== userId)
      throw new ForbiddenException("Not your resume.");
    return resume;
  }

  async remove(userId: string, resumeId: string) {
    const resume = await this.findOwned(userId, resumeId);
    await this.cloudinaryService.delete(resume.publicId, "raw");
    await resume.deleteOne();
    return true;
  }
}
