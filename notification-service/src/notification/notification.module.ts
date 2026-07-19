import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { NotificationController } from './notification.controller';
import { PrismaService } from '../prisma.service';
import { NotificationProcessor } from './notification.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-sending',
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationResolver,
    NotificationProcessor,
    PrismaService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
