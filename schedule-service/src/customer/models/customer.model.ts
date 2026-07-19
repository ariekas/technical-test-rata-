import { Field, ID, ObjectType, Int } from "@nestjs/graphql";

@ObjectType({ description: 'Data entitas Pelanggan (Customer)' })
export class Customer {
    @Field(() => ID, { description: 'ID unik pelanggan' })
    id: string;

    @Field(() => String, { description: 'Nama lengkap pelanggan' })
    name: string;

    @Field(() => String, { description: 'Alamat email pelanggan' })
    email: string;

    @Field({ description: 'Waktu data pelanggan didaftarkan' })
    createdAt: Date;

    @Field({ description: 'Waktu pembaruan data pelanggan terakhir kali' })
    updatedAt: Date;
}

@ObjectType({ description: 'Data pelanggan dengan format paginasi' })
export class PaginatedCustomer {
    @Field(() => [Customer], { description: 'Daftar data pelanggan pada halaman aktif' })
    items: Customer[];

    @Field(() => Int, { description: 'Jumlah total pelanggan yang terdaftar' })
    total: number;

    @Field(() => Int, { description: 'Nomor halaman saat ini' })
    page: number;

    @Field(() => Int, { description: 'Batas jumlah data per halaman' })
    limit: number;

    @Field(() => Int, { description: 'Jumlah total halaman yang tersedia' })
    totalPages: number;
}