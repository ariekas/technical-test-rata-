import { Field, Int, InputType } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';

@InputType({ description: 'Parameter input untuk pengaturan paginasi data' })
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1, description: 'Nomor halaman data yang ingin diambil (dimulai dari 1)' })
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @Field(() => Int, { defaultValue: 10, description: 'Batas jumlah data per halaman' })
  @IsOptional()
  @Min(1)
  limit?: number = 10;
}
