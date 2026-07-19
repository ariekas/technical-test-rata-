import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../prisma.service';
import { RedisService } from '../redis/redis.service';
import { ConflictException } from '@nestjs/common';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prisma: PrismaService;
  let redisService: RedisService;
  let notificationClient: any;

  const mockPrismaService = {
    doctor: {
      findUnique: jest.fn(),
    },
    customer: {
      findUnique: jest.fn(),
    },
    schedule: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn(),
  };

  const mockClientProxy = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: 'NOTIFICATION_SERVICE', useValue: mockClientProxy },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    prisma = module.get<PrismaService>(PrismaService);
    redisService = module.get<RedisService>(RedisService);
    notificationClient = module.get('NOTIFICATION_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a schedule and emit event successfully', async () => {
      const input = {
        objective: 'Consultation',
        scheduledAt: new Date(),
        customerId: 'customer-1',
        doctorId: 'doctor-1',
      };

      const doctor = { id: 'doctor-1', name: 'Dr. Smith' };
      const customer = { id: 'customer-1', name: 'John Doe', email: 'john@example.com' };
      const createdSchedule = {
        id: 'schedule-1',
        objective: input.objective,
        scheduledAt: input.scheduledAt,
        customer,
        doctor,
      };

      mockPrismaService.doctor.findUnique.mockResolvedValue(doctor);
      mockPrismaService.customer.findUnique.mockResolvedValue(customer);
      mockPrismaService.schedule.findFirst.mockResolvedValue(null);
      mockPrismaService.schedule.create.mockResolvedValue(createdSchedule);

      const result = await service.create(input);

      expect(result).toEqual(createdSchedule);
      expect(mockClientProxy.emit).toHaveBeenCalledWith('schedule_created', {
        objective: createdSchedule.objective,
        scheduledAt: createdSchedule.scheduledAt.toISOString(),
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        doctorId: doctor.id,
        doctorName: doctor.name,
      });
      expect(mockRedisService.clear).toHaveBeenCalled();
    });

    it('should throw error if doctor not found', async () => {
      mockPrismaService.doctor.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          objective: 'Test',
          scheduledAt: new Date(),
          customerId: 'customer-1',
          doctorId: 'doctor-1',
        }),
      ).rejects.toThrow('Doctor not found');
    });

    it('should throw error if customer not found', async () => {
      mockPrismaService.doctor.findUnique.mockResolvedValue({ id: 'doctor-1' });
      mockPrismaService.customer.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          objective: 'Test',
          scheduledAt: new Date(),
          customerId: 'customer-1',
          doctorId: 'doctor-1',
        }),
      ).rejects.toThrow('Customer not found');
    });

    it('should throw ConflictException if doctor has schedule at same time', async () => {
      mockPrismaService.doctor.findUnique.mockResolvedValue({ id: 'doctor-1' });
      mockPrismaService.customer.findUnique.mockResolvedValue({ id: 'customer-1' });
      mockPrismaService.schedule.findFirst.mockResolvedValue({ id: 'existing-schedule' });

      await expect(
        service.create({
          objective: 'Test',
          scheduledAt: new Date(),
          customerId: 'customer-1',
          doctorId: 'doctor-1',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getAll', () => {
    it('should return cached schedules if present', async () => {
      const cached = { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockRedisService.get.mockResolvedValue(cached);

      const result = await service.getAll({ page: 1, limit: 10 });
      expect(result).toEqual(cached);
      expect(mockRedisService.get).toHaveBeenCalled();
    });

    it('should query DB and set cache if not cached', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockPrismaService.schedule.findMany.mockResolvedValue([]);
      mockPrismaService.schedule.count.mockResolvedValue(0);

      const result = await service.getAll({ page: 1, limit: 10 });
      expect(result).toEqual({ items: [], total: 0, page: 1, limit: 10, totalPages: 0 });
      expect(mockRedisService.set).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete schedule and emit schedule_deleted', async () => {
      const schedule = {
        id: '1',
        objective: 'Test',
        scheduledAt: new Date(),
        customer: { id: 'customer-1', name: 'John Doe', email: 'john@example.com' },
        doctor: { id: 'doctor-1', name: 'Dr. Smith' },
      };

      mockPrismaService.schedule.findUnique.mockResolvedValue(schedule);
      mockPrismaService.schedule.delete.mockResolvedValue(schedule);

      const result = await service.delete('1');
      expect(result).toEqual(schedule);
      expect(mockClientProxy.emit).toHaveBeenCalledWith('schedule_deleted', expect.any(Object));
    });
  });
});
