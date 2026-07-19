import { Test, TestingModule } from '@nestjs/testing';
import { DoctorResolver } from './doctor.resolver';
import { DoctorService } from './doctor.service';

describe('DoctorResolver', () => {
  let resolver: DoctorResolver;
  let service: DoctorService;

  const mockDoctorService = {
    create: jest.fn(),
    update: jest.fn(),
    getAll: jest.fn(),
    getDoctorByID: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorResolver,
        { provide: DoctorService, useValue: mockDoctorService },
      ],
    }).compile();

    resolver = module.get<DoctorResolver>(DoctorResolver);
    service = module.get<DoctorService>(DoctorService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createDoctor', () => {
    it('should call DoctorService.create', async () => {
      const input = { name: 'Dr. John' };
      const response = { id: '1', ...input };
      mockDoctorService.create.mockResolvedValue(response);

      const result = await resolver.createDoctor(input);
      expect(result).toEqual(response);
      expect(mockDoctorService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('updateDoctor', () => {
    it('should call DoctorService.update', async () => {
      const input = { id: '1', name: 'Dr. John Updated' };
      const response = { id: '1', name: 'Dr. John Updated' };
      mockDoctorService.update.mockResolvedValue(response);

      const result = await resolver.updateDoctor(input);
      expect(result).toEqual(response);
      expect(mockDoctorService.update).toHaveBeenCalledWith(input);
    });
  });

  describe('doctors', () => {
    it('should call DoctorService.getAll', async () => {
      const pagination = { page: 1, limit: 10 };
      const response = { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockDoctorService.getAll.mockResolvedValue(response);

      const result = await resolver.doctors(pagination);
      expect(result).toEqual(response);
      expect(mockDoctorService.getAll).toHaveBeenCalledWith(pagination);
    });
  });

  describe('doctor', () => {
    it('should call DoctorService.getDoctorByID', async () => {
      const id = '1';
      const response = { id, name: 'Dr. John' };
      mockDoctorService.getDoctorByID.mockResolvedValue(response);

      const result = await resolver.doctor(id);
      expect(result).toEqual(response);
      expect(mockDoctorService.getDoctorByID).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteDoctor', () => {
    it('should call DoctorService.delete', async () => {
      const id = '1';
      const response = { id, name: 'Dr. John' };
      mockDoctorService.delete.mockResolvedValue(response);

      const result = await resolver.deleteDoctor(id);
      expect(result).toEqual(response);
      expect(mockDoctorService.delete).toHaveBeenCalledWith(id);
    });
  });
});
