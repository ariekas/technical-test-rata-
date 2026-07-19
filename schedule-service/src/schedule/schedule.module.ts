import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ScheduleService } from "./schedule.service";
import { ScheduleResolver } from "./schedule.resolver";
import { PrismaService } from "../prisma.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
    ]),
  ],
  providers: [ScheduleService, ScheduleResolver, PrismaService],
})
export class ScheduleModule {}
