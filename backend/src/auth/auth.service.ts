import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { UsersService } from "../users/users.service";
import { RegisterInput } from "./dto/register.input";
import { LoginInput } from "./dto/login.input";
import { ForgotPasswordInput } from "./dto/forgot-password.input";
import { ResetPasswordInput } from "./dto/reset-password.input";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing)
      throw new ConflictException(
        "Email already registered — try logging in instead.",
      );

    const hashed = await bcrypt.hash(input.password, 10);
    const user = await this.usersService.create({
      email: input.email,
      password: hashed,
      fullName: input.fullName,
    });

    return this.buildPayload(user);
  }

  async login(input: LoginInput) {
    const user = await this.usersService.findByEmail(input.email);
    if (!user) throw new UnauthorizedException("Invalid email or password.");

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedException("Invalid email or password.");

    return this.buildPayload(user);
  }

  private buildPayload(user: any) {
    const accessToken = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });
    return { accessToken, user };
  }

  async forgotPassword(input: ForgotPasswordInput) {
    const user = await this.usersService.findByEmail(input.email);
    // Always return the same success response whether or not the email exists —
    // this avoids leaking which emails are registered.
    const genericResponse = {
      success: true,
      message:
        "If that email is registered, a password reset link has been generated.",
    };
    if (!user) return genericResponse;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    await this.usersService.update((user as any)._id.toString(), {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    } as any);

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${rawToken}`;

    // NOTE: No email service (SMTP) is configured in this project yet, so the
    // reset link is logged here instead of being emailed. Wire up a real mailer
    // (e.g. nodemailer + SMTP creds in .env) and send `resetUrl` to the user's
    // email in production instead of relying on this console log.
    console.log(`\n[AuthService] Password reset requested for ${user.email}`);
    console.log(`[AuthService] Reset link (valid 30 min): ${resetUrl}\n`);

    return genericResponse;
  }

  async resetPassword(input: ResetPasswordInput) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(input.token)
      .digest("hex");
    const user = await this.usersService.findByResetToken(hashedToken);
    if (!user) {
      throw new BadRequestException(
        "That reset link is invalid or has expired. Please request a new one.",
      );
    }

    const hashed = await bcrypt.hash(input.newPassword, 10);
    await this.usersService.update((user as any)._id.toString(), {
      password: hashed,
      resetPasswordToken: null,
      resetPasswordExpires: new Date(0), // invalidate immediately so the token can't be reused
    } as any);

    return {
      success: true,
      message: "Your password has been reset. You can now log in.",
    };
  }
}
