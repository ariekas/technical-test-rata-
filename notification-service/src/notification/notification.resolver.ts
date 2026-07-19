import { Resolver, Query } from '@nestjs/graphql';
import { Notification } from './models/notification.model';
import { PrismaService } from '../prisma.service';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [Notification])
  async notifications(): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
