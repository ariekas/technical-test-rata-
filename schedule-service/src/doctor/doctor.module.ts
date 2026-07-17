import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorResolver } from './doctor.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [DoctorService, DoctorResolver, PrismaService],
})
export class DoctorModule {}
