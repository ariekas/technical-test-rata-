import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { PrismaService } from '../prisma.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let prisma: PrismaService;

  const mockPrismaService = {
    customer: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer successfully', async () => {
      const input = { name: 'Alice', email: 'alice@example.com' };
      const createdCustomer = { id: '1', ...input, createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.customer.findUnique.mockResolvedValue(null);
      mockPrismaService.customer.create.mockResolvedValue(createdCustomer);

      const result = await service.create(input);
      expect(result).toEqual(createdCustomer);
      expect(mockPrismaService.customer.create).toHaveBeenCalledWith({ data: input });
    });

    it('should throw an error if email is already registered', async () => {
      const input = { name: 'Alice', email: 'alice@example.com' };
      mockPrismaService.customer.findUnique.mockResolvedValue({ id: '1', ...input });

      await expect(service.create(input)).rejects.toThrow('Email already registered');
    });
  });

  describe('update', () => {
    it('should update a customer successfully', async () => {
      const input = { id: '1', name: 'Alice Updated', email: 'alice@example.com' };
      const existingCustomer = { id: '1', name: 'Alice', email: 'alice@example.com' };
      const updatedCustomer = { ...existingCustomer, name: input.name };

      mockPrismaService.customer.findUnique.mockResolvedValue(existingCustomer);
      mockPrismaService.customer.update.mockResolvedValue(updatedCustomer);

      const result = await service.update(input);
      expect(result).toEqual(updatedCustomer);
    });

    it('should throw error if customer not found', async () => {
      const input = { id: '1', name: 'Alice' };
      mockPrismaService.customer.findUnique.mockResolvedValue(null);

      await expect(service.update(input)).rejects.toThrow('Customer not found');
    });

    it('should throw error if updating email to one that is already taken', async () => {
      const input = { id: '1', name: 'Alice', email: 'taken@example.com' };
      const existingCustomer = { id: '1', name: 'Alice', email: 'alice@example.com' };

      mockPrismaService.customer.findUnique
        .mockResolvedValueOnce(existingCustomer) // for getCustomerByID
        .mockResolvedValueOnce({ id: '2', email: 'taken@example.com' }); // for getCustomerByEmail

      await expect(service.update(input)).rejects.toThrow('Email already taken');
    });
  });

  describe('getAll', () => {
    it('should return paginated customers', async () => {
      const items = [{ id: '1', name: 'Alice', email: 'alice@example.com' }];
      mockPrismaService.customer.findMany.mockResolvedValue(items);
      mockPrismaService.customer.count.mockResolvedValue(1);

      const result = await service.getAll({ page: 1, limit: 10 });
      expect(result).toEqual({
        items,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('delete', () => {
    it('should delete a customer successfully', async () => {
      const id = '1';
      const existingCustomer = { id, name: 'Alice', email: 'alice@example.com' };

      mockPrismaService.customer.findUnique.mockResolvedValue(existingCustomer);
      mockPrismaService.customer.delete.mockResolvedValue(existingCustomer);

      const result = await service.delete(id);
      expect(result).toEqual(existingCustomer);
      expect(mockPrismaService.customer.delete).toHaveBeenCalledWith({ where: { id } });
    });

    it('should throw error if customer to delete does not exist', async () => {
      mockPrismaService.customer.findUnique.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow('Customer not found');
    });
  });
});
