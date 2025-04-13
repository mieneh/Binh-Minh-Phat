import {
  IsEmail,
  IsOptional,
  IsString,
  IsIn,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

class AddressDto {
  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== '')
  province: string;

  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== '')
  ward?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== '')
  street?: string;
}

export class CreateUserDto {
  @IsEmail({}, { message: i18nValidationMessage('user.invalidEmail') })
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== '')
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsOptional()
  @IsIn(['admin', 'employee'], {
    message: i18nValidationMessage('user.invalidRole'),
  })
  role?: 'admin' | 'employee';
}
