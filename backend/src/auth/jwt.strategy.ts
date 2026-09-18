import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "super_secret_change_me",
    });
  }

  async validate(payload: { sub: string; email?: string }) {
    console.log("[JwtStrategy] validating token payload:", payload);
    try {
      const user = await this.usersService.findById(payload.sub);
      console.log(
        "[JwtStrategy] user lookup result:",
        user ? `found (${user.email})` : "NOT FOUND in database",
      );
      return user;
    } catch (err) {
      console.log("[JwtStrategy] error looking up user:", err.message);
      return null;
    }
  }
}
