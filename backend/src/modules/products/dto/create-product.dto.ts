import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  lot: string;
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsMongoId()
  partnerId?: string;
}
