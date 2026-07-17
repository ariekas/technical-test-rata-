import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './models/customer.model';
import { CreateCustomerInput, UpdateCustomerInput } from './dto/customer.input';

@Resolver()
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

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
