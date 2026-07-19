import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType({ description: 'Data entitas Pengguna (User)' })
export class User {
  @Field(() => ID, { description: 'ID unik pengguna' })
  id: string;

  @Field({ description: 'Alamat email pengguna yang terdaftar' })
  email: string;

  @Field({ description: 'Waktu pembuatan akun pengguna' })
  createdAt: Date;

  @Field({ description: 'Waktu pembaruan akun pengguna terakhir kali' })
  updatedAt: Date;
}
