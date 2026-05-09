import { IsEmail, IsNotEmpty, IsString, MinLength, Length, Matches } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4, { message: 'Full name must be at least 4 characters' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only digits' })
  phone: string;
}
