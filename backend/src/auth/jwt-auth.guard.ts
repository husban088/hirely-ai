import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.log(
        "[JwtAuthGuard] auth failed. err:",
        err,
        "| info:",
        info?.message || info,
      );
    }
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message || "Unauthorized");
    }
    return user;
  }
}
