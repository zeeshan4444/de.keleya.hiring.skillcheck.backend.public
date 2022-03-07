import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword, matchHashedPassword } from 'src/common/utils/password';
import { UserIsDeactivateException, IncorrectCredentialException } from './exceptions/user.exception';
import { JwtHelperService } from '../common/utils/jwt_helper.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly jwtHelperService: JwtHelperService,
  ) {}

  /**
   * Finds users with matching fields
   *
   * @param findUserDto
   * @returns User[]
   */

  async find(findUserDto: FindUserDto): Promise<User[]> {
    // Todo: Count query
    // Depend on bussiness logic exclude all archived then add in filter is_archived: false
    const filter = [];
    filter.push({ is_admin: false });
    if (findUserDto.email)
      filter.push({
        email: findUserDto.email,
      });
    if (findUserDto.name)
      filter.push({
        name: { contains: findUserDto.name },
      });
    if (findUserDto.updatedSince)
      filter.push({
        updated_at: { lte: findUserDto.updatedSince },
      });
    if (findUserDto.id) {
      filter.push({
        id: { in: findUserDto.id.map((elem) => Number(elem)) },
      });
    }
    return await this.prisma.user.findMany({
      where: { AND: filter },
      include: {
        credential: findUserDto.credentials ? true : false,
      },
      take: findUserDto.limit ? Number(findUserDto.limit) : 10,
      skip: findUserDto.offset ? Number(findUserDto.offset) : 0,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  /**
   * Finds single User by id, name or email
   *
   * @param whereUnique
   * @returns User
   */
  async findUnique(whereUnique: Prisma.UserWhereUniqueInput, includeCredentials = false) {
    return await this.prisma.user.findUnique({
      where: whereUnique,
      include: {
        credential: includeCredentials,
      },
    });
  }
  /**
   * Creates a new user with credentials
   *
   * @param createUserDto
   * @returns result of create
   */
  async create(createUserDto: CreateUserDto): Promise<any> {
    const userObj = {
      name: createUserDto.name,
      email: createUserDto.email,
      credential: {
        create: {
          hash: await hashPassword(createUserDto.password),
        },
      },
    };
    const found = await this.prisma.user.create({ data: userObj });
    return found;
  }

  /**
   * Updates a user unless it does not exist or has been marked as deleted before
   *
   * @param updateUserDto
   * @returns result of update
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const foundResult = await this.prisma.user.findFirst({ where: { id: id, is_archived: false } });
    if (!foundResult) throw new NotFoundException();
    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
  }

  /**
   * Deletes a user
   * Function does not actually remove the user from database but instead marks them as deleted by:
   * - removing the corresponding `credentials` row from your db
   * - changing the name to DELETED_USER_NAME constant (default: `(deleted)`)
   * - setting email to NULL
   *
   * @param deleteUserDto
   * @returns results of users and credentials table modification
   */

  // Comment:Not quite sure about the bussiness requiremnt but rather making null and putting the name DELETED_USER_NAME
  // we can make them is_archive true
  async delete(id: number, deleteUserDto: DeleteUserDto) {
    // Why default value doesnot comes here
    deleteUserDto.is_archived = true;
    deleteUserDto.archive_at = new Date();
    deleteUserDto.name = '(deleted)';
    // Discuss with PO if want to null then have to remove unique check
    // deleteUserDto.email = null;
    return await this.prisma.user.update({
      where: { id: id },
      data: deleteUserDto,
    });
  }

  /**
   * Authenticates a user and returns a JWT token
   *
   * @param authenticateUserDto email and password for authentication
   * @returns a JWT token
   */
  async authenticateAndGetJwtToken(authenticateUserDto: AuthenticateUserDto) {
    const userData = await this.checkCredentials(authenticateUserDto);
    if (userData.id && userData.credential) {
      const accessToken = await this.jwtHelperService.generateAccessToken(userData.id, userData.email);
      const refreshToken = await this.jwtHelperService.generateRefreshToken(userData.id, userData.email);
      const JwtTokenResponse = {
        id: userData.id,
        email: userData.email,
        token: accessToken,
        refreshToken,
      };
      return JwtTokenResponse;
    }
  }

  /**
   * Authenticates a user
   *
   * @param authenticateUserDto email and password for authentication
   * @returns true or false
   */
  async authenticate(authenticateUserDto: AuthenticateUserDto) {
    return this.checkCredentials(authenticateUserDto);
  }

  private async checkCredentials(authenticateUserDto: AuthenticateUserDto) {
    const { email, password } = authenticateUserDto;
    const foundUserInfo = await this.prisma.user.findFirst({
      where: { email: email },
      include: {
        credential: true,
      },
    });
    if (foundUserInfo && foundUserInfo.credential && matchHashedPassword(password, foundUserInfo.credential.hash)) {
      return foundUserInfo;
    }
  }

  /**
   * Validates a JWT token
   *
   * @param token a JWT token
   * @returns the decoded token if valid
   */
  async validateToken(token: string) {
    return this.jwtHelperService.verifyAccessToken(token);
  }
}
