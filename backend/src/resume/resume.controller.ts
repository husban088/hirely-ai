import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ResumeService } from "./resume.service";

// REST endpoint used for multipart file upload (simpler & more reliable than GraphQL multipart spec).
@Controller("api/resume")
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body("targetRole") targetRole: string,
    @Body("targetMarket") targetMarket: string,
    @Req() req: any,
  ) {
    if (!file) throw new BadRequestException("No file uploaded.");
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.mimetype)
    ) {
      throw new BadRequestException("Only PDF or DOCX files are supported.");
    }

    return this.resumeService.uploadAndAnalyze(
      req.user._id.toString(),
      { buffer: file.buffer, originalname: file.originalname },
      targetRole || "Software Engineer",
      targetMarket || "US",
    );
  }
}
