import { IsString, IsAlpha, IsOptional, IsDate, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  // @IsAlpha()
  @IsOptional()
  name: string;

  @IsDate()
  @IsOptional()
  updated_at: Date;

  @IsBoolean()
  @IsOptional()
  email_confirmed: boolean;
}
