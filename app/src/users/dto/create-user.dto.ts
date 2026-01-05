import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string; 

  @ApiProperty({ example: 'coder@riwi.io', description: 'Unique email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string; 

  @ApiProperty({ example: 'SecurePass123!', description: 'Password (min 6 chars)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.CODER, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole; 
}