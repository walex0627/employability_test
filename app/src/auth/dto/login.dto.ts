import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'walter@riwi.io', 
    description: 'Registered email' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'BlueSky123!', 
    description: 'User password' 
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}