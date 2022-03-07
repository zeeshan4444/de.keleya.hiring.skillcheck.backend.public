import {
  IsString,
  IsOptional,
  Min,
  Max,
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsEmail,
  IsAlpha,
  IsNumberString,
  Contains,
  IsDateString,
} from 'class-validator';

export class FindUserDto {
  @IsNumberString()
  @IsOptional()
  // @Min(1)
  // @Max(1000)
  limit: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(1000)
  offset: number;

  @IsDateString()
  @IsOptional()
  updatedSince: Date;

  @IsString()
  // @IsAlpha()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  id: number[];

  @IsString()
  @IsOptional()
  @Contains('true')
  credentials: string;
}
