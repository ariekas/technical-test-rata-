import { Field, ID, ObjectType, Int } from "@nestjs/graphql";
import { Customer } from "../../customer/models/customer.model";
import { Doctor } from "../../doctor/models/doctor.model";

@ObjectType({ description: 'Data entitas Jadwal Pertemuan (Schedule)' })
export class Schedule {
    @Field(() => ID, { description: 'ID unik jadwal pertemuan' })
    id: string;

    @Field({ description: 'Tujuan atau deskripsi pertemuan medis' })
    objective: string;

    @Field({ description: 'ID pelanggan yang bersangkutan' })
    customerId: string;

    @Field({ description: 'ID dokter yang bertugas' })
    doctorId: string;

    @Field({ description: 'Waktu pelaksanaan pertemuan medis' })
    scheduledAt: Date;

    @Field({ description: 'Waktu pembuatan data jadwal' })
    createdAt: Date;

    @Field({ description: 'Waktu pembaruan data jadwal terakhir kali' })
    updatedAt: Date;

    @Field(() => Customer, { nullable: true, description: 'Informasi lengkap pelanggan' })
    customer?: Customer;

    @Field(() => Doctor, { nullable: true, description: 'Informasi lengkap dokter' })
    doctor?: Doctor;
}

@ObjectType({ description: 'Data jadwal pertemuan dengan format paginasi' })
export class PaginatedSchedule {
    @Field(() => [Schedule], { description: 'Daftar jadwal pertemuan pada halaman aktif' })
    items: Schedule[];

    @Field(() => Int, { description: 'Jumlah total jadwal yang terdaftar' })
    total: number;

    @Field(() => Int, { description: 'Nomor halaman saat ini' })
    page: number;

    @Field(() => Int, { description: 'Batas jumlah data per halaman' })
    limit: number;

    @Field(() => Int, { description: 'Jumlah total halaman yang tersedia' })
    totalPages: number;
}

