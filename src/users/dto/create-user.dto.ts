import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Por favor preencha todos os campos' })
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Por favor preencha todos os campos' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'Por favor preencha todos os campos' })
  @IsString()
  password: string;
}
