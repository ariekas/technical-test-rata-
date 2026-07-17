import { Field, ID, ObjectType } from "@nestjs/graphql";
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
