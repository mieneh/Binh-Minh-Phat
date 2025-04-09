import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsMongoId,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRecruitmentDto {
  @IsNotEmpty()
  @IsMongoId()
  positionId: string;

  @IsString()
  address: string;

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
