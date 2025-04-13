import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsString()
  street?: string;
}

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  branchName: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsString()
  @IsNotEmpty()
  hotline?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== '')
  note?: string;
}
