import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDoctorInput, UpdateDoctorInput, PaginationInput } from './dto/doctor.input';
import { Doctor } from '@prisma/client';
import { paginate } from '../common/paginate';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateDoctorInput): Promise<Doctor> {
    return this.prisma.doctor.create({
      data: {
        name: input.name,
      },
    });
  }

  async getDoctorByID(id: string): Promise<Doctor | null> {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    return doctor;
  }

  async update(input: UpdateDoctorInput): Promise<Doctor> {
    await this.getDoctorByID(input.id);
    const { id, ...data } = input;
    return this.prisma.doctor.update({
      where: { id },
      data,
    });
  }

  async getAll(pagination?: PaginationInput) {
    return paginate<Doctor>(
      this.prisma.doctor,
      {
        orderBy: {
          createdAt: 'desc',
        },
      },
      {
        page: pagination?.page,
        limit: pagination?.limit,
      },
    );
  }

  async delete(id: string): Promise<Doctor> {
    await this.getDoctorByID(id);
    return this.prisma.doctor.delete({
      where: { id },
    });
  }
}
