import { User } from './entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    let userUpdateInput: Prisma.UserUpdateInput = updateUserDto;

    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    if (updateUserDto.password) {
      userUpdateInput = {
        ...userUpdateInput,
        password: await bcrypt.hash(updateUserDto.password, 10),
      };
    }

    const userUpdated = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...userUpdateInput,
      },
    });

    return userUpdated;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
