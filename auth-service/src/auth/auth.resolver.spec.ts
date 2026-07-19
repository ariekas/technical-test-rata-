import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    Login: jest.fn(),
    validateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('register', () => {
    it('should delegate to AuthService.register', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      const response = { user: { id: '1', email: 'test@example.com' } };
      mockAuthService.register.mockResolvedValue(response);

      const result = await resolver.register(input);
      expect(result).toEqual(response);
      expect(mockAuthService.register).toHaveBeenCalledWith(input);
    });
  });

  describe('login', () => {
    it('should delegate to AuthService.Login', async () => {
      const input = { email: 'test@example.com', password: 'password123' };
      const response = { token: 'mocktoken' };
      mockAuthService.Login.mockResolvedValue(response);

      const result = await resolver.login(input);
      expect(result).toEqual(response);
      expect(mockAuthService.Login).toHaveBeenCalledWith(input);
    });
  });

  describe('validateToken', () => {
    it('should delegate to AuthService.validateToken', async () => {
      const token = 'mocktoken';
      const response = { isValid: true, user: { id: '1', email: 'test@example.com' } };
      mockAuthService.validateToken.mockResolvedValue(response);

      const result = await resolver.validateToken(token);
      expect(result).toEqual(response);
      expect(mockAuthService.validateToken).toHaveBeenCalledWith(token);
    });
  });
});
