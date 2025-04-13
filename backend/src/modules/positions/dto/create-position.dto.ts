import { IsNotEmpty, IsMongoId, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreatePositionDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  name: string;

  @IsMongoId()
  departmentId: string;

  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== '')
  description?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== '')
  requirement?: string;
}
