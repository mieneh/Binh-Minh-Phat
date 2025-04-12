import { IsOptional, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ResetPasswordDto {
  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: i18nValidationMessage('user.passwordMin'),
  })
  newPassword?: string;
}
