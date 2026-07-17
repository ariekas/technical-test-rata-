import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsUUID, IsDate } from "class-validator";
import { Transform } from "class-transformer";

@InputType()
export class CreateScheduleInput {
    @Field()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty()
    objective: string;

    @Field()
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @Field()
    @IsUUID()
    @IsNotEmpty()
    doctorId: string;

    @Field()
    @IsDate()
    @IsNotEmpty()
    scheduledAt: Date;
}
