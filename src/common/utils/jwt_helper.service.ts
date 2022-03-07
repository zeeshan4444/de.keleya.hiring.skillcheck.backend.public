import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtHelperService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async generateAccessToken(id: number, email: string): Promise<string> {
    const signOption: JwtSignOptions = {
      algorithm: 'HS256',
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
      issuer: this.configService.get('JWT_ISSUER'),
    };
    return this.jwtService.sign({ id, email }, signOption);
  }

  async generateRefreshToken(id: number, email: string): Promise<string> {
    const signOption: JwtSignOptions = {
      algorithm: 'HS256',
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
      issuer: this.configService.get('JWT_ISSUER'),
    };
    return this.jwtService.sign({ id, email }, signOption);
  }

  async verifyAccessToken(accessToken: string) {
    const verifyOption: JwtVerifyOptions = {
      algorithms: ['HS256'],
      issuer: this.configService.get('JWT_ISSUER'),
      secret: this.configService.get('JWT_SECRET'),
    };
    const foundToken = await this.jwtService.verifyAsync(accessToken, verifyOption);
    if (foundToken.id) return true;
    else return false;
  }
}
