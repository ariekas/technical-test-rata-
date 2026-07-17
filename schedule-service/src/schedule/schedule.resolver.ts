import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { ScheduleService } from "./schedule.service";
import { Schedule, PaginatedSchedule } from "./models/schedule.model";
import { CreateScheduleInput, ScheduleFilterInput } from "./dto/schedule.input";
import { PaginationInput } from "../common/dto/pagination.input";

@Resolver(() => Schedule)
export class ScheduleResolver {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Mutation(() => Schedule)
  async createSchedule(
    @Args('input') input: CreateScheduleInput,
  ): Promise<Schedule> {
    return this.scheduleService.create(input);
  }

  @Query(() => PaginatedSchedule)
  async schedules(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @Args('filter', { nullable: true }) filter?: ScheduleFilterInput,
  ): Promise<PaginatedSchedule> {
    return this.scheduleService.getAll(pagination, filter);
  }

  @Query(() => Schedule, { nullable: true })
  async schedule(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Schedule | null> {
    return this.scheduleService.getScheduleByID(id);
  }
}
