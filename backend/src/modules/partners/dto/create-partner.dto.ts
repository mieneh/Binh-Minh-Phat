import {
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

class ContactDto {
  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== '')
  phone?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== '')
  email?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== '')
  hotline?: string;
}

export class CreatePartnerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  @IsUrl({}, { message: i18nValidationMessage('partner.invalidWebsite') })
  website?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  @IsString()
  address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactDto)
  contact?: ContactDto;

  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  @IsString()
  note?: string;
}
