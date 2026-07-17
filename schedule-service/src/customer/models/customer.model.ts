import { Field, ID, ObjectType, Int } from "@nestjs/graphql";

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

@ObjectType()
export class PaginatedCustomer {
    @Field(() => [Customer])
    items: Customer[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Int)
    totalPages: number;
}