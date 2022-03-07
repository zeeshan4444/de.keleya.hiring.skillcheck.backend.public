import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtHelperService } from 'src/common/utils/jwt_helper.service';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule.register({})],
  providers: [UserService, JwtStrategy, JwtHelperService],
  controllers: [UserController],
})
export class UserModule {}
