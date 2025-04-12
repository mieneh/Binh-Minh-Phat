import { IsOptional, IsString, ValidateNested } from 'class-validator';
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
  branchName: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsOptional()
  @IsString()
  hotline?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
