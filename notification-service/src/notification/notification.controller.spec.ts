import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  const mockNotificationService = {
    queueEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleScheduleCreated', () => {
    it('should queue CREATE email', async () => {
      const data = {
        objective: 'Test',
        scheduledAt: new Date().toISOString(),
        customerId: 'customer-1',
        customerName: 'John',
        customerEmail: 'john@example.com',
        doctorId: 'doctor-1',
        doctorName: 'Dr. Smith',
      };

      await controller.handleScheduleCreated(data);

      expect(mockNotificationService.queueEmail).toHaveBeenCalledWith('CREATE', data);
    });
  });

  describe('handleScheduleDeleted', () => {
    it('should queue DELETE email', async () => {
      const data = {
        objective: 'Test',
        scheduledAt: new Date().toISOString(),
        customerId: 'customer-1',
        customerName: 'John',
        customerEmail: 'john@example.com',
        doctorId: 'doctor-1',
        doctorName: 'Dr. Smith',
      };

      await controller.handleScheduleDeleted(data);

      expect(mockNotificationService.queueEmail).toHaveBeenCalledWith('DELETE', data);
    });
  });
});
