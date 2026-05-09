import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, Length } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4, { message: 'Full name must be at least 4 characters' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'Password must be at least 8 characters with one uppercase letter and one number',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  phone: string;
}
