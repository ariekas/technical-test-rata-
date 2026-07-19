import { Test, TestingModule } from '@nestjs/testing';
import { NotificationProcessor } from './notification.processor';
import { NotificationService } from './notification.service';
import * as Bull from 'bull';

describe('NotificationProcessor', () => {
  let processor: NotificationProcessor;
  let service: NotificationService;

  const mockNotificationService = {
    sendScheduleCreatedEmail: jest.fn(),
    sendScheduleDeletedEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationProcessor,
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    processor = module.get<NotificationProcessor>(NotificationProcessor);
    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('handleSendEmail', () => {
    const payload = {
      objective: 'Consultation',
      scheduledAt: new Date().toISOString(),
      customerId: 'customer-1',
      customerName: 'John',
      customerEmail: 'john@example.com',
      doctorId: 'doctor-1',
      doctorName: 'Dr. Smith',
    };

    it('should call sendScheduleCreatedEmail for type CREATE', async () => {
      const mockJob = {
        id: 'job-1',
        data: { type: 'CREATE', payload },
      } as Bull.Job;

      await processor.handleSendEmail(mockJob);

      expect(mockNotificationService.sendScheduleCreatedEmail).toHaveBeenCalledWith(payload);
    });

    it('should call sendScheduleDeletedEmail for type DELETE', async () => {
      const mockJob = {
        id: 'job-2',
        data: { type: 'DELETE', payload },
      } as Bull.Job;

      await processor.handleSendEmail(mockJob);

      expect(mockNotificationService.sendScheduleDeletedEmail).toHaveBeenCalledWith(payload);
    });

    it('should throw error if service fails', async () => {
      const mockJob = {
        id: 'job-3',
        data: { type: 'CREATE', payload },
      } as Bull.Job;

      mockNotificationService.sendScheduleCreatedEmail.mockRejectedValueOnce(new Error('Send failed'));

      await expect(processor.handleSendEmail(mockJob)).rejects.toThrow('Send failed');
    });
  });
});
