import { Field, ID, ObjectType, Int } from "@nestjs/graphql";

@ObjectType({ description: 'Data entitas Dokter (Doctor)' })
export class Doctor {
    @Field(() => ID, { description: 'ID unik dokter' })
    id: string;

    @Field(() => String, { description: 'Nama lengkap dokter' })
    name: string;

    @Field({ description: 'Waktu dokter didaftarkan' })
    createdAt: Date;

    @Field({ description: 'Waktu pembaruan data dokter terakhir kali' })
    updatedAt: Date;
}

@ObjectType({ description: 'Data dokter dengan format paginasi' })
export class PaginatedDoctor {
    @Field(() => [Doctor], { description: 'Daftar dokter pada halaman aktif' })
    items: Doctor[];

    @Field(() => Int, { description: 'Jumlah total dokter yang terdaftar' })
    total: number;

    @Field(() => Int, { description: 'Nomor halaman saat ini' })
    page: number;

    @Field(() => Int, { description: 'Batas jumlah data per halaman' })
    limit: number;

    @Field(() => Int, { description: 'Jumlah total halaman yang tersedia' })
    totalPages: number;
}
