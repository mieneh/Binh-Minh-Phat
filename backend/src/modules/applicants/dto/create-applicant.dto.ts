import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApplicantStatus } from 'src/schemas/applicant.schema';

class AddressDto {
  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  ward: string;

  @IsString()
  @IsNotEmpty()
  street: string;
}

export class CreateApplicantDto {
  @IsMongoId()
  @IsNotEmpty()
  recruitmentId: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  shortProfile?: string;

  @IsOptional()
  @IsString()
  cvLink?: string;

  @IsString()
  @IsNotEmpty()
  positionCodeSnapshot: string;

  @IsOptional()
  @IsEnum(ApplicantStatus)
  status?: ApplicantStatus;
}
