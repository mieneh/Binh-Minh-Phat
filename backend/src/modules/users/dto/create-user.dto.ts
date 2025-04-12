import {
  IsEmail,
  IsOptional,
  IsString,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

class AddressDto {
  @IsOptional()
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsString()
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
