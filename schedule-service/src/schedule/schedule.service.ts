import { Injectable, NotFoundException, ConflictException, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PrismaService } from "../prisma.service";
import { CreateScheduleInput, ScheduleFilterInput } from "./dto/schedule.input";
import { Schedule, PaginatedSchedule } from "./models/schedule.model";
import { PaginationInput } from "../common/dto/pagination.input";
import { paginate } from "../common/paginate";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationClient: ClientProxy,
  ) {}

  private getCacheKey(pagination?: PaginationInput, filter?: ScheduleFilterInput): string {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const customerId = filter?.customerId ?? 'all';
    const doctorId = filter?.doctorId ?? 'all';
    const dateStr = filter?.date ? new Date(filter.date).toISOString().split('T')[0] : 'all';

    return `schedules:page=${page}:limit=${limit}:customer=${customerId}:doctor=${doctorId}:date=${dateStr}`;
  }

  private async clearScheduleCache(): Promise<void> {
    await this.redisService.clear();
  }

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

    const newSchedule = await this.prisma.schedule.create({
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

    this.notificationClient.emit('schedule_created', {
      objective: newSchedule.objective,
      scheduledAt: newSchedule.scheduledAt.toISOString(),
      customerId: newSchedule.customer.id,
      customerName: newSchedule.customer.name,
      customerEmail: newSchedule.customer.email,
      doctorId: newSchedule.doctor.id,
      doctorName: newSchedule.doctor.name,
    });
    await this.clearScheduleCache();

    return newSchedule;
  }

  async getAll(pagination?: PaginationInput, filter?: ScheduleFilterInput): Promise<PaginatedSchedule> {
    const cacheKey = this.getCacheKey(pagination, filter);
    const cachedData = await this.redisService.get<PaginatedSchedule>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

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

    const result = await paginate<Schedule>(
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

    await this.redisService.set(cacheKey, result, 3600);

    return result;
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

  async delete(id: string): Promise<Schedule> {
    await this.getScheduleByID(id);
    const deletedSchedule = await this.prisma.schedule.delete({
      where: { id },
      include: {
        customer: true,
        doctor: true,
      },
    });

    this.notificationClient.emit('schedule_deleted', {
      objective: deletedSchedule.objective,
      scheduledAt: deletedSchedule.scheduledAt.toISOString(),
      customerId: deletedSchedule.customer.id,
      customerName: deletedSchedule.customer.name,
      customerEmail: deletedSchedule.customer.email,
      doctorId: deletedSchedule.doctor.id,
      doctorName: deletedSchedule.doctor.name,
    });
    await this.clearScheduleCache();

    return deletedSchedule;
  }
}

