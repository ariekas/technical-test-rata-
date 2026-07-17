import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer, PaginatedCustomer } from './models/customer.model';
import { CreateCustomerInput, UpdateCustomerInput } from './dto/customer.input';
import { PaginationInput } from '../common/dto/pagination.input';
import { AuthGuard } from '../common/guards/auth.guard';

@Resolver()
@UseGuards(AuthGuard)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => PaginatedCustomer)
  async customers(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PaginatedCustomer> {
    return this.customerService.getAll(pagination);
  }

  @Query(() => Customer, { nullable: true })
  async customer(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Customer | null> {
    return this.customerService.getCustomerByID(id);
  }

  @Mutation(() => Customer)
  async createCustomer(
    @Args('input') input: CreateCustomerInput,
  ): Promise<Customer> {
    return this.customerService.create(input);
  }

  @Mutation(() => Customer)
  async updateCustomer(
    @Args('input') input: UpdateCustomerInput,
  ): Promise<Customer> {
    return this.customerService.update(input);
  }

  @Mutation(() => Customer)
  async deleteCustomer(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Customer> {
    return this.customerService.delete(id);
  }
}
