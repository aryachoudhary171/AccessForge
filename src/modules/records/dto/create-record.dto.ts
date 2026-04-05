import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateRecordDto {
  @IsString() title?: string;

  @IsNumber() amount?: number;

  @IsEnum(['income', 'expense']) type?: 'income' | 'expense';

  @IsString() category?: string;

  @IsOptional()
  @IsString() description?: string;
}

