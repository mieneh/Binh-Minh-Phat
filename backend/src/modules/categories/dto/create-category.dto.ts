import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @ValidateIf((_, value) => value !== '')
  description?: string;
}
