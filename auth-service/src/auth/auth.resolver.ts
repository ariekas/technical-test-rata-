import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterResponse, LoginResponse } from './models/auth.model';
import { AuthInput } from './dto/auth.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => RegisterResponse)
  async register(@Args('input') input: AuthInput): Promise<RegisterResponse> {
    return this.authService.register(input);
  }

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: AuthInput): Promise<LoginResponse> {
    return this.authService.Login(input);
  }

  @Query(() => String)
  hello() {
    return 'Auth Service is running!';
  }
}
