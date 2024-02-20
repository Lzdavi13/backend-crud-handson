import { User } from './entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUserDto): Promise<User> {
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (userAlreadyExists) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'E-mail já cadastrado!' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const data: Prisma.UserCreateInput = {
      ...user,
      password: await bcrypt.hash(user.password, 10),
    };

    const createUser = await this.prisma.user.create({
      data,
    });

    return {
      ...createUser,
      password: undefined,
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
