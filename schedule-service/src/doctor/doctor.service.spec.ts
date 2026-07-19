import { Test, TestingModule } from '@nestjs/testing';
import { DoctorService } from './doctor.service';
import { PrismaService } from '../prisma.service';

describe('DoctorService', () => {
  let service: DoctorService;
  let prisma: PrismaService;

  const mockPrismaService = {
    doctor: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a doctor successfully', async () => {
      const input = { name: 'Dr. John' };
      const createdDoctor = { id: '1', ...input, createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.doctor.create.mockResolvedValue(createdDoctor);

      const result = await service.create(input);
      expect(result).toEqual(createdDoctor);
      expect(mockPrismaService.doctor.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('getDoctorByID', () => {
    it('should return a doctor if found', async () => {
      const doctor = { id: '1', name: 'Dr. John' };
      mockPrismaService.doctor.findUnique.mockResolvedValue(doctor);

      const result = await service.getDoctorByID('1');
      expect(result).toEqual(doctor);
    });

    it('should throw an error if doctor is not found', async () => {
      mockPrismaService.doctor.findUnique.mockResolvedValue(null);

      await expect(service.getDoctorByID('1')).rejects.toThrow('Doctor not found');
    });
  });

  describe('update', () => {
    it('should update a doctor successfully', async () => {
      const input = { id: '1', name: 'Dr. John Updated' };
      const doctor = { id: '1', name: 'Dr. John' };

      mockPrismaService.doctor.findUnique.mockResolvedValue(doctor);
      mockPrismaService.doctor.update.mockResolvedValue({ ...doctor, name: input.name });

      const result = await service.update(input);
      expect(result.name).toEqual(input.name);
    });
  });

  describe('getAll', () => {
    it('should return paginated doctors', async () => {
      const items = [{ id: '1', name: 'Dr. John' }];
      mockPrismaService.doctor.findMany.mockResolvedValue(items);
      mockPrismaService.doctor.count.mockResolvedValue(1);

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
    it('should delete a doctor successfully', async () => {
      const doctor = { id: '1', name: 'Dr. John' };

      mockPrismaService.doctor.findUnique.mockResolvedValue(doctor);
      mockPrismaService.doctor.delete.mockResolvedValue(doctor);

      const result = await service.delete('1');
      expect(result).toEqual(doctor);
    });
  });
});
