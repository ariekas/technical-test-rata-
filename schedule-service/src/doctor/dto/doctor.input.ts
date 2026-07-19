import { Field, ID, InputType, PartialType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType({ description: 'Data masukan untuk mendaftarkan dokter baru' })
export class CreateDoctorInput {
  @Field({ description: 'Nama lengkap dokter' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  name: string;
}

@InputType({ description: 'Data masukan untuk memperbarui profil dokter' })
export class UpdateDoctorInput extends PartialType(CreateDoctorInput) {
  @Field(() => ID, { description: 'ID dokter yang akan diperbarui' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

