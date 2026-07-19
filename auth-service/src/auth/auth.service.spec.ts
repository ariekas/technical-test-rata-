import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      const createdUser = { id: '1', email: input.email, password: 'hashedpassword' };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.register(input);

      expect(result).toEqual({ user: createdUser });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: input.email } });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { email: input.email, password: 'hashedpassword' },
      });
    });

    it('should throw an error if email is already registered', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', email: input.email });

      await expect(service.register(input)).rejects.toThrow('Email already registered');
    });
  });

  describe('Login', () => {
    it('should login successfully and return a token', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      const user = { id: '1', email: input.email, password: 'hashedpassword' };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('mocktoken');

      const result = await service.Login(input);

      expect(result).toEqual({ token: 'mocktoken' });
    });

    it('should throw an error if user is not found', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.Login(input)).rejects.toThrow('Email atau Password salah');
    });

    it('should throw an error if password does not match', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      const user = { id: '1', email: input.email, password: 'hashedpassword' };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.Login(input)).rejects.toThrow('Email atau Password salah');
    });
  });

  describe('validateToken', () => {
    it('should validate a token and return the user', async () => {
      const token = 'validtoken';
      const payload = { id: '1' };
      const user = { id: '1', email: 'test@example.com' };

      mockJwtService.verify.mockReturnValue(payload);
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.validateToken(token);

      expect(result).toEqual({ isValid: true, user });
    });

    it('should throw error if user is not found', async () => {
      const token = 'validtoken';
      const payload = { id: '1' };

      mockJwtService.verify.mockReturnValue(payload);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.validateToken(token)).rejects.toThrow('Invalid or expired token');
    });

    it('should throw error if token verification fails', async () => {
      const token = 'invalidtoken';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      await expect(service.validateToken(token)).rejects.toThrow('Invalid or expired token');
    });
  });
});
