import { Field, InputType, ID, Int, PartialType } from "@nestjs/graphql";
import { IsNotEmpty, IsEmail, IsUUID, IsOptional, Min } from "class-validator";
import { Transform } from "class-transformer";

@InputType({ description: 'Data masukan untuk membuat profil pelanggan baru' })
export class CreateCustomerInput {
    @Field({ description: 'Nama lengkap pelanggan' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty()
    name: string;

    @Field({ description: 'Alamat email pelanggan' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

@InputType({ description: 'Data masukan untuk memperbarui profil pelanggan' })
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
    @Field(() => ID, { description: 'ID pelanggan yang akan diperbarui' })
    @IsUUID()
    @IsNotEmpty()
    id: string;
}
