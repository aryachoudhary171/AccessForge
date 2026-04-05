import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class UpdateRecordDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsNumber() amount?: number;
  @IsOptional() @IsEnum(['income', 'expense']) type?: 'income' | 'expense';
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() description?: string;
}