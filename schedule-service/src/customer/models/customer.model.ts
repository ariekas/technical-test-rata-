import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Customer {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    email: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}