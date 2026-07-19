import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType({ description: 'Input data untuk proses autentikasi (registrasi atau login)' })
export class AuthInput {
  @Field({ description: 'Alamat email pengguna, harus berupa format email yang valid' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field({ description: 'Kata sandi pengguna, minimal memiliki panjang 6 karakter' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
