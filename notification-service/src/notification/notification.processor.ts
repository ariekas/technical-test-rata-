import { Process, Processor } from '@nestjs/bull';
import * as Bull from 'bull';
import { NotificationService, EmailPayload } from './notification.service';

@Processor('email-sending')
export class NotificationProcessor {
  constructor(private readonly notificationService: NotificationService) {}

  @Process('send-email')
  async handleSendEmail(
    job: Bull.Job<{ type: 'CREATE' | 'DELETE'; payload: EmailPayload }>,
  ) {
    const { type, payload } = job.data;

    try {
      if (type === 'CREATE') {
        await this.notificationService.sendScheduleCreatedEmail(payload);
      } else if (type === 'DELETE') {
        await this.notificationService.sendScheduleDeletedEmail(payload);
      }
      console.log(
        `[Notification Processor] Job ${job.id} completed successfully.`,
      );
    } catch (error) {
      console.error(`[Notification Processor] Job ${job.id} failed:`, error);
      throw error;
    }
  }
}
