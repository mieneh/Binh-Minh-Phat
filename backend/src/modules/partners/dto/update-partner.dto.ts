import { PartialType } from '@nestjs/mapped-types';
import { CreatePartnerDto } from './create-partner.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
  @IsOptional()
  @IsBoolean()
  removeLogo?: boolean;
}
