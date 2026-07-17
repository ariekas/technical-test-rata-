import { Field, InputType, ID, Int, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsEmail, IsUUID, IsOptional, Min } from "class-validator";
import { Transform } from "class-transformer";

@InputType()
export class CreateCustomerInput {
    @Field()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty()
    name: string;

    @Field()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

@InputType()
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
    @Field(() => ID)
    @IsUUID()
    @IsNotEmpty()
    id: string;
}
