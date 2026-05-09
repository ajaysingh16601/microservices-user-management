import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'New password must be at least 8 characters with one uppercase letter and one number',
  })
  newPassword: string;
}
