import { InputType } from '@nestjs/graphql';

@InputType({ description: 'Data input untuk mengirim notifikasi' })
export class SendNotificationInput {}
