import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType({ description: 'Respon hasil registrasi akun baru' })
export class RegisterResponse {
  @Field(() => User, { description: 'Data profil user yang berhasil dibuat' })
  user: User;
}

@ObjectType({ description: 'Respon hasil login yang berisi token akses' })
export class LoginResponse {
  @Field({ description: 'Access token JWT untuk autentikasi request selanjutnya' })
  token: string;
}

@ObjectType({ description: 'Respon validasi token akses' })
export class ValidateTokenResponse {
  @Field({ description: 'Menunjukkan apakah token yang diperiksa valid atau tidak' })
  isValid: boolean;

  @Field(() => User, { description: 'Data profil user pemilik token' })
  user: User;
}