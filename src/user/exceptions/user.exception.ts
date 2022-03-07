import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';

export class UserIsDeactivateException extends BadRequestException {
  constructor() {
    super('Current User is deactivate...');
  }
}

export class IncorrectCredentialException extends ForbiddenException {
  constructor() {
    super('login.LOGIN.INCORRECT');
  }
}

export class UserDataNotFoundException extends NotFoundException {
  constructor() {
    super('No Record Found..');
  }
}
