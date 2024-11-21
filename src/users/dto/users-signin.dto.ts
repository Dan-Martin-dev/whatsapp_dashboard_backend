import { IsNotEmpty, IsString, MinLength } from 'class-validator';

// data validation
export class UserSignInDto {
  @IsNotEmpty({ message: 'Email cannot be null' })
  @IsString({ message: 'Email should be a string' })
  email: string; // Terminate with a semicolon

  @IsNotEmpty({ message: 'Password cannot be null' })
  @MinLength(5, { message: 'Password should have at least 5 characters' })
  password: string; // Terminate with a semicolon
}
