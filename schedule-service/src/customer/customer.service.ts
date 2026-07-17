import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCustomerInput, UpdateCustomerInput } from './dto/customer.input';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateCustomerInput): Promise<Customer> {
    const customer = await this.getCustomerByEmail(input.email);

    if (customer) {
      throw new Error('Email already registered');
    }

    return this.prisma.customer.create({
      data: {
        name: input.name,
        email: input.email,
      },
    });
  }

  async update(input: UpdateCustomerInput): Promise<Customer> {
    const customer = await this.getCustomerByID(input.id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (input.email && input.email !== customer.email) {
      const customerEmail = await this.getCustomerByEmail(input.email);
      if (customerEmail) {
        throw new Error('Email already taken');
      }
    }

    const { id, ...data } = input;
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({ where: { email } });
  }

  async getCustomerByID(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }
}
