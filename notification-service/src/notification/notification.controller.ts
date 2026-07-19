import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService, EmailPayload } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('schedule_created')
  async handleScheduleCreated(@Payload() data: EmailPayload) {
    await this.notificationService.queueEmail('CREATE', data);
  }

  @EventPattern('schedule_deleted')
  async handleScheduleDeleted(@Payload() data: EmailPayload) {
    await this.notificationService.queueEmail('DELETE', data);
  }
}
