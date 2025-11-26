import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  IsBoolean,
  IsOptional,
  } from 'class-validator';
import { Role } from 'generated/prisma/client';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsIn(['USER', 'SUPER_ADMIN', 'RESTAURANT_OWNER'])
  role: Role;

  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  is_completed_profile: boolean;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  completed_profile_step: number;
}
