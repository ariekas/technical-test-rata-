import { Test, TestingModule } from '@nestjs/testing';
import { NotificationResolver } from './notification.resolver';
import { PrismaService } from '../prisma.service';

describe('NotificationResolver', () => {
  let resolver: NotificationResolver;
  let prisma: PrismaService;

  const mockPrismaService = {
    notification: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationResolver,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    resolver = module.get<NotificationResolver>(NotificationResolver);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('notifications', () => {
    it('should return all notifications', async () => {
      const items = [{ id: '1', objective: 'Consultation' }];
      mockPrismaService.notification.findMany.mockResolvedValue(items);

      const result = await resolver.notifications();
      expect(result).toEqual(items);
      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
