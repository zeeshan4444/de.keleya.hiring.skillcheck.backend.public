import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtAdminGuard extends AuthGuard(['jwt']) implements CanActivate {
  private readonly logger = new Logger(JwtAdminGuard.name);

  constructor(private readonly userService: UserService, private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.user && req.user.is_admin) {
      return true;
    }
    console.log('Required Admin Access');
    throw new UnauthorizedException();
  }
}
