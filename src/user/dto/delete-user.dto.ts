import { IsBoolean, IsDate, IsEmail, IsObject, IsOptional, IsString } from 'class-validator';
export class DeleteUserDto {
  @IsBoolean()
  @IsOptional()
  is_archived: true;

  @IsDate()
  @IsOptional()
  archive_at: Date;

  @IsString()
  @IsOptional()
  name: '(deleted)';

  @IsOptional()
  email: null;

  @IsObject()
  @IsOptional()
  credential: {
    delete: true;
  };
}
