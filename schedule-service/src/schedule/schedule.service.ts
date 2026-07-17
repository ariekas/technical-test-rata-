import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateScheduleInput, ScheduleFilterInput } from "./dto/schedule.input";
import { Schedule } from "./models/schedule.model";
import { PaginationInput } from "../common/dto/pagination.input";
import { paginate } from "../common/paginate";

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateScheduleInput): Promise<Schedule> {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: input.doctorId } });
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const customer = await this.prisma.customer.findUnique({ where: { id: input.customerId } });
    if (!customer) {
      throw new Error("Customer not found");
    }

    const checkDoctorSchedule = await this.prisma.schedule.findFirst({
      where: {
        doctorId: input.doctorId,
        scheduledAt: input.scheduledAt,
      },
    });

    if (checkDoctorSchedule) {
      throw new ConflictException("Doctor already has a schedule at this time");
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

  async getAll(pagination?: PaginationInput, filter?: ScheduleFilterInput) {
    const where: any = {};

    if (filter?.customerId) {
      where.customerId = filter.customerId;
    }

    if (filter?.doctorId) {
      where.doctorId = filter.doctorId;
    }

    if (filter?.date) {
      const minDate = new Date(filter.date);
      minDate.setUTCHours(0, 0, 0, 0);
      const maxDate = new Date(filter.date);
      maxDate.setUTCHours(23, 59, 59, 999);
      where.scheduledAt = {
        gte: minDate,
        lte: maxDate,
      };
    }

    return paginate<Schedule>(
      this.prisma.schedule,
      {
        where,
        orderBy: {
          scheduledAt: 'desc',
        },
        include: {
          customer: true,
          doctor: true,
        },
      },
      {
        page: pagination?.page,
        limit: pagination?.limit,
      },
    );
  }

  async getScheduleByID(id: string): Promise<Schedule> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        customer: true,
        doctor: true,
      },
    });

    if (!schedule) {
      throw new Error("Schedule not found");
    }

    return schedule;
  }
}

