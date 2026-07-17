import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer, PaginatedCustomer } from './models/customer.model';
import { CreateCustomerInput, UpdateCustomerInput, PaginationInput } from './dto/customer.input';

@Resolver()
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => PaginatedCustomer)
  async customers(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PaginatedCustomer> {
    return this.customerService.getAll(pagination);
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
}
