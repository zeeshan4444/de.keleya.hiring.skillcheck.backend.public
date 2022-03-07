import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

export type UnencryptedPassword = string;

@ValidatorConstraint({ name: 'unencryptedPasswordValidator', async: true })
@Injectable()
export class UnencryptedPasswordValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(val: UnencryptedPassword, args: ValidationArguments) {
    if (!val) return false;
    return this.isValidPassword(val);
  }

  // Todo: Criteria can be part of config table.
  isValidPassword(passwordToValidate: string): boolean {
    if (!passwordToValidate) return false;
    // TODO: Uncomment the check as per bussiness logic
    if (
      // /(?=.*?[a-z])/.test(passwordToValidate) &&
      // /(?=.*?[A-Z])/.test(passwordToValidate) &&
      // /(?=.*?[0-9])/.test(passwordToValidate) &&
      passwordToValidate.length > 4 &&
      passwordToValidate.length <= 20
    )
      return true;
    else {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return `Password is not complex enough`;
  }
}
