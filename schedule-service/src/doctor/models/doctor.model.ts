import { Field, ID, ObjectType, Int } from "@nestjs/graphql";

@ObjectType()
export class Doctor {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    name: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@ObjectType()
export class PaginatedDoctor {
    @Field(() => [Doctor])
    items: Doctor[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Int)
    totalPages: number;
}
