import { IsEmail, IsEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmpty({ message: 'Por favor preencha todos os campos' })
  @IsString()
  name: string;

  @IsEmail()
  @IsEmpty({ message: 'Por favor preencha todos os campos' })
  @IsString()
  email: string;

  @IsEmpty({ message: 'Por favor preencha todos os campos' })
  @IsString()
  password: string;
}
