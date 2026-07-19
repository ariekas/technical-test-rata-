import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthInput } from './dto/auth.input';
import { LoginResponse, RegisterResponse, ValidateTokenResponse } from './models/auth.model';
import { User } from '@prisma/client';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async register(input: AuthInput): Promise<RegisterResponse> {

    const user = await this.GetUserByEmail(input.email)

    if (user) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const createUser = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
      },
    });

    return {
      user: createUser,
    };
  }

  async GetUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    return user;
  }

  async Login(input: AuthInput): Promise<LoginResponse> {

    const user = await this.GetUserByEmail(input.email)
    if (!user) {
      throw new Error('Email atau Password salah');
    }

    const checkPasswordValid = await bcrypt.compare(input.password, user.password)

    if (!checkPasswordValid) {
      throw new Error('Email atau Password salah');
    }
    const token = this.jwtService.sign({ id: user.id });
    return {
      token,
    };
  }

  async validateToken(token: string): Promise<ValidateTokenResponse> {
    try {
      const payload = this.jwtService.verify(token);
      
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return { isValid: true, user };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
