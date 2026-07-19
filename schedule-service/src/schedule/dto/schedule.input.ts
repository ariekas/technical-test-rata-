import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsUUID, IsDate, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

@InputType({ description: 'Data masukan untuk membuat jadwal pertemuan baru' })
export class CreateScheduleInput {
    @Field({ description: 'Tujuan atau deskripsi pertemuan medis' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsNotEmpty()
    objective: string;

    @Field({ description: 'ID pelanggan yang bersangkutan' })
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @Field({ description: 'ID dokter yang bertugas' })
    @IsUUID()
    @IsNotEmpty()
    doctorId: string;

    @Field({ description: 'Waktu pelaksanaan pertemuan medis' })
    @IsDate()
    @IsNotEmpty()
    scheduledAt: Date;
}

@InputType({ description: 'Filter pencarian data jadwal pertemuan' })
export class ScheduleFilterInput {
    @Field({ nullable: true, description: 'Filter berdasarkan ID pelanggan' })
    @IsUUID()
    @IsOptional()
    customerId?: string;

    @Field({ nullable: true, description: 'Filter berdasarkan ID dokter' })
    @IsUUID()
    @IsOptional()
    doctorId?: string;

    @Field({ nullable: true, description: 'Filter berdasarkan spesifik tanggal pertemuan' })
    @IsDate()
    @IsOptional()
    date?: Date;
}

