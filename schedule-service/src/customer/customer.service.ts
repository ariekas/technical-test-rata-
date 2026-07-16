import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCustomerInput } from './dto/customer.input';
import { Customer } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateCustomerInput): Promise<Customer> {
    const customer = await this.GetCustomerByEmail(input.email);

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

  async GetCustomerByEmail(email: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({ where: { email } });
  }
}
