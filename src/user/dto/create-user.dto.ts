import { IsEmail, IsString, Length, Validate } from 'class-validator';
import { UnencryptedPasswordValidator } from 'src/common/validators/unencrypted-password-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Validate(UnencryptedPasswordValidator)
  password: string;
}
