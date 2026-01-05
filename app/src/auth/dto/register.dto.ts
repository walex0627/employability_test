import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'Walter White', 
    description: 'Full name of the new coder' 
  })
  @IsString()
  @IsNotEmpty()
  name: string; // [cite: 78]

  @ApiProperty({ 
    example: 'walter@riwi.io', 
    description: 'Unique email address' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string; // [cite: 79]

  @ApiProperty({ 
    example: 'BlueSky123!', 
    description: 'Password (min 6 characters)' 
  })
  @IsString()
  @MinLength(6)
  password: string; // [cite: 80]
}