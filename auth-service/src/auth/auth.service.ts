import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthInput } from './dto/auth.input';
import {  RegisterResponse } from './models/auth.model';
import {  User} from './models/user.model';


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

  async GetUserByEmail(email:string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });
    return user;
  }
}


