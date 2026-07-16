import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterResponse, LoginResponse, ValidateTokenResponse } from './models/auth.model';
import { AuthInput } from './dto/auth.input';
import { UseGuards } from '@nestjs/common';
import { RateLimitGuard } from './guards/rate-limit.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => RegisterResponse)
  async register(@Args('input') input: AuthInput): Promise<RegisterResponse> {
    return this.authService.register(input);
  }

  @Mutation(() => LoginResponse)
  @UseGuards(RateLimitGuard)
  async login(@Args('input') input: AuthInput): Promise<LoginResponse> {
    return this.authService.Login(input);
  }

  @Query(() => ValidateTokenResponse)
  async validateToken(@Args('token') token: string): Promise<ValidateTokenResponse> {
    return this.authService.validateToken(token);
  }
}
