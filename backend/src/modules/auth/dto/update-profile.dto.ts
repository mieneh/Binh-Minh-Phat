import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsObject()
  address?: {
    province?: string;
    ward?: string;
    street?: string;
  };

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  removeAvatar?: boolean;
}
