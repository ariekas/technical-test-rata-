import { Test, TestingModule } from '@nestjs/testing';
import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';

describe('CustomerResolver', () => {
  let resolver: CustomerResolver;
  let service: CustomerService;

  const mockCustomerService = {
    create: jest.fn(),
    update: jest.fn(),
    getAll: jest.fn(),
    getCustomerByID: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerResolver,
        { provide: CustomerService, useValue: mockCustomerService },
      ],
    }).compile();

    resolver = module.get<CustomerResolver>(CustomerResolver);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCustomer', () => {
    it('should call CustomerService.create', async () => {
      const input = { name: 'Alice', email: 'alice@example.com' };
      const response = { id: '1', ...input };
      mockCustomerService.create.mockResolvedValue(response);

      const result = await resolver.createCustomer(input);
      expect(result).toEqual(response);
      expect(mockCustomerService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('updateCustomer', () => {
    it('should call CustomerService.update', async () => {
      const input = { id: '1', name: 'Alice Updated' };
      const response = { id: '1', name: 'Alice Updated', email: 'alice@example.com' };
      mockCustomerService.update.mockResolvedValue(response);

      const result = await resolver.updateCustomer(input);
      expect(result).toEqual(response);
      expect(mockCustomerService.update).toHaveBeenCalledWith(input);
    });
  });

  describe('customers', () => {
    it('should call CustomerService.getAll', async () => {
      const pagination = { page: 1, limit: 10 };
      const response = { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockCustomerService.getAll.mockResolvedValue(response);

      const result = await resolver.customers(pagination);
      expect(result).toEqual(response);
      expect(mockCustomerService.getAll).toHaveBeenCalledWith(pagination);
    });
  });

  describe('customer', () => {
    it('should call CustomerService.getCustomerByID', async () => {
      const id = '1';
      const response = { id, name: 'Alice', email: 'alice@example.com' };
      mockCustomerService.getCustomerByID.mockResolvedValue(response);

      const result = await resolver.customer(id);
      expect(result).toEqual(response);
      expect(mockCustomerService.getCustomerByID).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteCustomer', () => {
    it('should call CustomerService.delete', async () => {
      const id = '1';
      const response = { id, name: 'Alice', email: 'alice@example.com' };
      mockCustomerService.delete.mockResolvedValue(response);

      const result = await resolver.deleteCustomer(id);
      expect(result).toEqual(response);
      expect(mockCustomerService.delete).toHaveBeenCalledWith(id);
    });
  });
});
