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

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  @IsOptional()
  @Min(1)
  limit?: number = 10;
}