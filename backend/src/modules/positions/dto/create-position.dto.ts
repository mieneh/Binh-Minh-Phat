import { IsNotEmpty, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  name: string;

  @IsMongoId()
  departmentId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirement?: string;
}
