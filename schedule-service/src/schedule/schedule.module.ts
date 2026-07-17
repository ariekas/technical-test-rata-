import { Module } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { ScheduleResolver } from "./schedule.resolver";
import { PrismaService } from "../prisma.service";

@Module({
  providers: [ScheduleService, ScheduleResolver, PrismaService],
})
export class ScheduleModule {}
