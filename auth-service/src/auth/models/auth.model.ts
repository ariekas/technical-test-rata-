import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class RegisterResponse {
  @Field(() => User)
  user: User;
}

@ObjectType()
export class LoginResponse {
  @Field()
  token: string;
}

@ObjectType()
export class ValidateTokenResponse {
  @Field()
  isValid: boolean;

  @Field(() => User)
  user: User;
}