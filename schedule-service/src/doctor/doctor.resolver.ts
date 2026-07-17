import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor, PaginatedDoctor } from './models/doctor.model';
import {
  CreateDoctorInput,
  UpdateDoctorInput,
} from './dto/doctor.input';
import { PaginationInput } from '../common/dto/pagination.input';
import { AuthGuard } from '../common/guards/auth.guard';

@Resolver()
@UseGuards(AuthGuard)
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Mutation(() => Doctor)
  async createDoctor(@Args('input') input: CreateDoctorInput): Promise<Doctor> {
    return this.doctorService.create(input);
  }

  @Query(() => Doctor, { nullable: true })
  async doctor(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Doctor | null> {
    return this.doctorService.getDoctorByID(id);
  }

  @Mutation(() => Doctor)
  async updateDoctor(@Args('input') input: UpdateDoctorInput): Promise<Doctor> {
    return this.doctorService.update(input);
  }

  @Query(() => PaginatedDoctor)
  async doctors(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PaginatedDoctor> {
    return this.doctorService.getAll(pagination);
  }

  @Mutation(() => Doctor)
  async deleteDoctor(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Doctor> {
    return this.doctorService.delete(id);
  }
}
