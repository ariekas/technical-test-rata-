import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Notification {
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
  status: string;

  @Field()
  type: string;

  @Field()
  createdAt: Date;
}
