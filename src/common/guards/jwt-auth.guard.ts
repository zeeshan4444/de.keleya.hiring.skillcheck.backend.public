import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs/internal/Observable';
import { IS_PUBLIC_ENDPOINT_KEY } from '../decorators/publicEndpoint.decorator';
import * as request from 'supertest';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt']) implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const getMeta = (key: string) => this.reflector.get(key, context.getHandler());
    const isPublicEndpoint = getMeta(IS_PUBLIC_ENDPOINT_KEY);
    console.log('isPublicEndpoint', isPublicEndpoint);
    const request = context.switchToHttp().getRequest();
    const headerKey = request.headers.key;
    if (isPublicEndpoint == headerKey) return true;
    return super.canActivate(context);
  }
}
