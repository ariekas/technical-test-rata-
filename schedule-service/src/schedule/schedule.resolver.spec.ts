import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleResolver } from './schedule.resolver';
import { ScheduleService } from './schedule.service';

describe('ScheduleResolver', () => {
  let resolver: ScheduleResolver;
  let service: ScheduleService;

  const mockScheduleService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getScheduleByID: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleResolver,
        { provide: ScheduleService, useValue: mockScheduleService },
      ],
    }).compile();

    resolver = module.get<ScheduleResolver>(ScheduleResolver);
    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createSchedule', () => {
    it('should delegate to ScheduleService.create', async () => {
      const input = {
        objective: 'Consultation',
        scheduledAt: new Date(),
        customerId: 'customer-1',
        doctorId: 'doctor-1',
      };
      const response = { id: '1', ...input };
      mockScheduleService.create.mockResolvedValue(response);

      const result = await resolver.createSchedule(input);
      expect(result).toEqual(response);
      expect(mockScheduleService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('schedules', () => {
    it('should delegate to ScheduleService.getAll', async () => {
      const pagination = { page: 1, limit: 10 };
      const filter = { customerId: 'customer-1' };
      const response = { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockScheduleService.getAll.mockResolvedValue(response);

      const result = await resolver.schedules(pagination, filter);
      expect(result).toEqual(response);
      expect(mockScheduleService.getAll).toHaveBeenCalledWith(pagination, filter);
    });
  });

  describe('schedule', () => {
    it('should delegate to ScheduleService.getScheduleByID', async () => {
      const id = '1';
      const response = { id, objective: 'Consultation' };
      mockScheduleService.getScheduleByID.mockResolvedValue(response);

      const result = await resolver.schedule(id);
      expect(result).toEqual(response);
      expect(mockScheduleService.getScheduleByID).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteSchedule', () => {
    it('should delegate to ScheduleService.delete', async () => {
      const id = '1';
      const response = { id, objective: 'Consultation' };
      mockScheduleService.delete.mockResolvedValue(response);

      const result = await resolver.deleteSchedule(id);
      expect(result).toEqual(response);
      expect(mockScheduleService.delete).toHaveBeenCalledWith(id);
    });
  });
});
