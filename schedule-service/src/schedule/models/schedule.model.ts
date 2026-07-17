import { Field, ID, ObjectType, Int } from "@nestjs/graphql";
import { Customer } from "../../customer/models/customer.model";
import { Doctor } from "../../doctor/models/doctor.model";

@ObjectType()
export class Schedule {
    @Field(() => ID)
    id: string;

    @Field()
    objective: string;

    @Field()
    customerId: string;

    @Field()
    doctorId: string;

    @Field()
    scheduledAt: Date;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field(() => Customer, { nullable: true })
    customer?: Customer;

    @Field(() => Doctor, { nullable: true })
    doctor?: Doctor;
}

@ObjectType()
export class PaginatedSchedule {
    @Field(() => [Schedule])
    items: Schedule[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;

    @Field(() => Int)
    totalPages: number;
}

