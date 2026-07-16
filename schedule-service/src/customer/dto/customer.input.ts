import { Field, InputType, ID, Int, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsEmail, IsUUID, IsOptional, Min } from "class-validator";

@InputType()
export class CreateCustomerInput {
    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
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