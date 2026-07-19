import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import * as Bull from 'bull';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma.service';

export class EmailPayload {
  objective: string;
  scheduledAt: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  doctorId: string;
  doctorName: string;
}

@Injectable()
export class NotificationService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('email-sending') private readonly emailQueue: Bull.Queue,
  ) {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    }
  }

  async queueEmail(
    type: 'CREATE' | 'DELETE',
    payload: EmailPayload,
  ): Promise<void> {
    await this.emailQueue.add('send-email', { type, payload });
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    const from = process.env.SMTP_FROM || 'noreply@clinic.com';
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from,
          to,
          subject,
          html,
        });
        return true;
      } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        return false;
      }
    } else {
      console.log(`Mock Email to ${to}: ${subject}`);
      return true;
    }
  }

  private async logNotification(
    type: 'CREATE' | 'DELETE',
    data: EmailPayload,
    success: boolean,
  ): Promise<void> {
    try {
      await this.prisma.notification.create({
        data: {
          objective: data.objective,
          customerId: data.customerId,
          doctorId: data.doctorId,
          scheduledAt: new Date(data.scheduledAt),
          type,
          status: success ? 'SENT' : 'FAILED',
        },
      });
    } catch (dbError) {
      console.error('Gagal menyimpan log notifikasi ke database:', dbError);
    }
  }

  async sendScheduleCreatedEmail(data: EmailPayload): Promise<void> {
    const dateStr = new Date(data.scheduledAt).toLocaleString();
    const subject = `Jadwal Pertemuan Baru Dibuat - ${data.objective}`;
    const html = `
      <h3>Halo, ${data.customerName}!</h3>
      <p>Jadwal pertemuan baru Anda telah berhasil dibuat dengan rincian berikut:</p>
      <ul>
        <li><strong>Dokter:</strong> ${data.doctorName}</li>
        <li><strong>Tujuan:</strong> ${data.objective}</li>
        <li><strong>Waktu:</strong> ${dateStr}</li>
      </ul>
      <p>Terima kasih atas kepercayaan Anda.</p>
    `;

    const success = await this.sendEmail(data.customerEmail, subject, html);
    await this.logNotification('CREATE', data, success);
  }

  async sendScheduleDeletedEmail(data: EmailPayload): Promise<void> {
    const dateStr = new Date(data.scheduledAt).toLocaleString();
    const subject = `Jadwal Pertemuan Dibatalkan - ${data.objective}`;
    const html = `
      <h3>Halo, ${data.customerName}!</h3>
      <p>Kami ingin menginformasikan bahwa jadwal pertemuan Anda berikut telah dibatalkan:</p>
      <ul>
        <li><strong>Dokter:</strong> ${data.doctorName}</li>
        <li><strong>Tujuan:</strong> ${data.objective}</li>
        <li><strong>Waktu:</strong> ${dateStr}</li>
      </ul>
      <p>Silakan buat jadwal baru jika Anda masih membutuhkannya.</p>
    `;

    const success = await this.sendEmail(data.customerEmail, subject, html);
    await this.logNotification('DELETE', data, success);
  }
}
