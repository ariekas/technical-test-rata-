import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma.service';
import { getQueueToken } from '@nestjs/bull';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: '123' }),
  }),
}));

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: PrismaService;
  let emailQueue: any;
  let transporter: any;

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
    },
  };

  const mockEmailQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    process.env.SMTP_HOST = 'localhost';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user';
    process.env.SMTP_PASS = 'pass';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: getQueueToken('email-sending'), useValue: mockEmailQueue },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prisma = module.get<PrismaService>(PrismaService);
    emailQueue = module.get(getQueueToken('email-sending'));
    transporter = nodemailer.createTransport();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('queueEmail', () => {
    it('should add job to emailQueue', async () => {
      const payload = {
        objective: 'Consultation',
        scheduledAt: new Date().toISOString(),
        customerId: 'customer-1',
        customerName: 'John',
        customerEmail: 'john@example.com',
        doctorId: 'doctor-1',
        doctorName: 'Dr. Smith',
      };

      await service.queueEmail('CREATE', payload);

      expect(mockEmailQueue.add).toHaveBeenCalledWith('send-email', {
        type: 'CREATE',
        payload,
      });
    });
  });

  describe('sendScheduleCreatedEmail', () => {
    it('should send email and log to DB successfully', async () => {
      const payload = {
        objective: 'Consultation',
        scheduledAt: new Date().toISOString(),
        customerId: 'customer-1',
        customerName: 'John',
        customerEmail: 'john@example.com',
        doctorId: 'doctor-1',
        doctorName: 'Dr. Smith',
      };

      mockPrismaService.notification.create.mockResolvedValue({ id: 'log-1' });

      await service.sendScheduleCreatedEmail(payload);

      expect(transporter.sendMail).toHaveBeenCalled();
      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          objective: payload.objective,
          customerId: payload.customerId,
          doctorId: payload.doctorId,
          scheduledAt: expect.any(Date),
          type: 'CREATE',
          status: 'SENT',
        },
      });
    });

    it('should log failed status to DB if sending email fails', async () => {
      const payload = {
        objective: 'Consultation',
        scheduledAt: new Date().toISOString(),
        customerId: 'customer-1',
        customerName: 'John',
        customerEmail: 'john@example.com',
        doctorId: 'doctor-1',
        doctorName: 'Dr. Smith',
      };

      transporter.sendMail.mockRejectedValueOnce(new Error('SMTP error'));
      mockPrismaService.notification.create.mockResolvedValue({ id: 'log-2' });

      await service.sendScheduleCreatedEmail(payload);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          objective: payload.objective,
          customerId: payload.customerId,
          doctorId: payload.doctorId,
          scheduledAt: expect.any(Date),
          type: 'CREATE',
          status: 'FAILED',
        },
      });
    });
  });

  describe('sendScheduleDeletedEmail', () => {
    it('should send email and log to DB for deleted schedule', async () => {
      const payload = {
        objective: 'Consultation',
        scheduledAt: new Date().toISOString(),
        customerId: 'customer-1',
        customerName: 'John',
        customerEmail: 'john@example.com',
        doctorId: 'doctor-1',
        doctorName: 'Dr. Smith',
      };

      mockPrismaService.notification.create.mockResolvedValue({ id: 'log-3' });

      await service.sendScheduleDeletedEmail(payload);

      expect(transporter.sendMail).toHaveBeenCalled();
      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          objective: payload.objective,
          customerId: payload.customerId,
          doctorId: payload.doctorId,
          scheduledAt: expect.any(Date),
          type: 'DELETE',
          status: 'SENT',
        },
      });
    });
  });
});
