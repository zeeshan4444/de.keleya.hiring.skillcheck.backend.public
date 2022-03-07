import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  NotAcceptableException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeleteUserDto } from './dto/delete-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { EndpointIsPublic } from 'src/common/decorators/publicEndpoint.decorator';
import { JwtAdminGuard } from 'src/common/guards/jwt-admin.guard';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async find(@Query() findUserDto: FindUserDto, @Res() res: Response) {
    const foundUserData = await this.usersService.find(findUserDto);
    if (foundUserData) res.status(HttpStatus.OK).send(foundUserData);
    else res.status(HttpStatus.NOT_FOUND).send('Not Found');
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  // If you want to check admin access also with auth token
  // @UseGuards(AuthGuard('jwt'), JwtAdminGuard)
  async findUnique(@Param('id', ParseIntPipe) id, @Res() res: Response) {
    const foundUserInfo = await this.usersService.findUnique({ id: id });
    if (foundUserInfo) {
      res.status(HttpStatus.OK).send(foundUserInfo);
    } else {
      res.status(HttpStatus.NOT_FOUND).send({});
    }
  }

  @Post()
  // @EndpointIsPublic()
  @EndpointIsPublic('THISISTHEPUBLICAPIKEY')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
    return createdUser;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Param('id', ParseIntPipe) id, @Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    // Should not allow to change their own data unless you are admin
    if (req.user['id'] == id && !req.user['is_admin']) throw new NotAcceptableException();
    updateUserDto.updated_at = new Date();
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id', ParseIntPipe) id, @Body() deleteUserDto: DeleteUserDto) {
    return await this.usersService.delete(id, deleteUserDto);
  }

  @Post('validate')
  async userValidateToken(@Req() req: Request, @Res() res: Response) {
    if (!req.headers['authorization']) throw new Error('Broken');
    const headerToken = req.headers['authorization'].split(' ');
    if (headerToken[0] != 'Bearer') throw new Error('Broken');
    const validToken = await this.usersService.validateToken(headerToken[1]);
    res.status(HttpStatus.OK).send(validToken);
  }

  @Post('authenticate')
  async userAuthenticate(@Body() authenticateUserDto: AuthenticateUserDto, @Res() res: Response) {
    const result = await this.usersService.authenticate(authenticateUserDto);
    return res.status(HttpStatus.OK).send(result);
  }

  @Post('token')
  async userGetToken(@Body() authenticateUserDto: AuthenticateUserDto, @Res() res: Response) {
    const result = await this.usersService.authenticateAndGetJwtToken(authenticateUserDto);
    return res.status(HttpStatus.OK).send(result);
  }
}
