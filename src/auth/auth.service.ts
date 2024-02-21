import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaClient,
  ) {}

  async login(userLogin: UserLoginDto): Promise<UserToken> {
    const user = await this.findByEmail(userLogin.email);

    const isPasswordValid = await bcrypt.compare(
      userLogin.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    const payload: UserPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  private async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('Email não encontrado');
    }

    return user;
  }

  async validateUser(userPayload: UserPayload): Promise<User> {
    const user = this.prisma.user.findUnique({
      where: {
        id: userPayload.sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
