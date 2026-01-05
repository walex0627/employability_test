import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  // 1. Create a mock repository object
  // These functions simulate TypeORM methods (save, find, findOne, etc.)
  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((user) => Promise.resolve({ 
      id: 'uuid-123', 
      ...user, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    })),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository, // Inject the mock instead of real DB
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Test Case: Create User ---
  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@riwi.io',
        password: 'hashedPassword',
        role: UserRole.CODER,
      };

      const result = await service.create(createUserDto);

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'uuid-123',
        ...createUserDto,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  // --- Test Case: Find All ---
  describe('findAll', () => {
    it('should return an array of users', async () => {
      const usersArray = [{ name: 'User 1' }, { name: 'User 2' }];
      
      // We force the mock to return our test data
      jest.spyOn(repository, 'find').mockResolvedValue(usersArray as any);

      const result = await service.findAll();

      expect(result).toEqual(usersArray);
    });
  });

  // --- Test Case: Find One (Success) ---
  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: 'uuid-123', name: 'Found User' };
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as any);

      const result = await service.findOne('uuid-123');
      expect(result).toEqual(user);
    });

  // --- Test Case: Find One (Error) ---
    it('should throw NotFoundException if user not found', async () => {
      // Simulate that database returns null
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('uuid-999')).rejects.toThrow(NotFoundException);
    });
  });

  // --- Test Case: Find by Email (Crucial for Auth) ---
  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 'uuid-123', email: 'test@riwi.io' };
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(user as any);

      const result = await service.findOneByEmail('test@riwi.io');
      expect(result).toEqual(user);
    });
  });
});