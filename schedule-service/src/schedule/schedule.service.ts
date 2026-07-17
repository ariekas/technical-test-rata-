import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateScheduleInput } from "./dto/schedule.input";
import { Schedule } from "./models/schedule.model";

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateScheduleInput): Promise<Schedule> {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: input.doctorId } });
    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    const customer = await this.prisma.customer.findUnique({ where: { id: input.customerId } });
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    return this.prisma.schedule.create({
      data: {
        objective: input.objective,
        scheduledAt: input.scheduledAt,
        customer: { connect: { id: input.customerId } },
        doctor: { connect: { id: input.doctorId } }
      },
      include: {
        customer: true,
        doctor: true
      }
    });
  }
}
