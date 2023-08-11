import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  email: string;
  password: string;
}
