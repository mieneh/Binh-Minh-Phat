import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsMongoId,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateRecruitmentDto {
  @IsMongoId()
  positionId: string;

  @IsMongoId()
  addressId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  deadline: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  experience?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
