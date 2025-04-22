import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SignInAuthDto {
  @IsEmail({}, { message: i18nValidationMessage('auth.emailInvalid') })
  @IsNotEmpty({ message: i18nValidationMessage('auth.emailRequired') })
  email: string;

  @IsString({ message: i18nValidationMessage('auth.passwordString') })
  @MinLength(8, { message: i18nValidationMessage('auth.passwordMin') })
  password: string;
}

export class SignOutAuthDto {
  refreshToken: string;
}
