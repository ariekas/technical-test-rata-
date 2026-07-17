import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { ScheduleService } from "./schedule.service";
import { Schedule } from "./models/schedule.model";
import { CreateScheduleInput } from "./dto/schedule.input";

@Resolver(() => Schedule)
export class ScheduleResolver {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Mutation(() => Schedule)
  async createSchedule(
    @Args('input') input: CreateScheduleInput,
  ): Promise<Schedule> {
    return this.scheduleService.create(input);
  }
}
