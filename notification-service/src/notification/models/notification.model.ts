import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Data entitas Riwayat Notifikasi (Notification)' })
export class Notification {
  @Field(() => ID, { description: 'ID unik notifikasi' })
  id: string;

  @Field({ description: 'Tujuan atau deskripsi pertemuan medis yang dinotifikasikan' })
  objective: string;

  @Field({ description: 'ID pelanggan penerima notifikasi' })
  customerId: string;

  @Field({ description: 'ID dokter yang bersangkutan' })
  doctorId: string;

  @Field({ description: 'Waktu pelaksanaan pertemuan medis' })
  scheduledAt: Date;

  @Field({ description: 'Status pengiriman email notifikasi (misal: SENT, FAILED)' })
  status: string;

  @Field({ description: 'Jenis aksi pertemuan medis yang memicu notifikasi (CREATE atau DELETE)' })
  type: string;

  @Field({ description: 'Waktu notifikasi dikirim/dicatat' })
  createdAt: Date;
}
