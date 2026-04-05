import { IsEmail, IsString } from 'class-validator';

export class InitRegisterDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;
}