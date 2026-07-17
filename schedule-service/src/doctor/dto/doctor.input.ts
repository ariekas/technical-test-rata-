import { Field, ID, InputType, PartialType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateDoctorInput {
  @Field()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty()
  name: string;
}

@InputType()
export class UpdateDoctorInput extends PartialType(CreateDoctorInput) {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

