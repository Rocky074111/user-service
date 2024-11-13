import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let clientProxy: ClientProxy;

  const mockUser = {
    id: '123',
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  beforeEach(async () => {
    // Mocking the UserService methods
    const userServiceMock = {
      create: jest.fn().mockResolvedValue(mockUser),
      findOne: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
      delete: jest.fn().mockResolvedValue(true),
    };

    // Mocking the ClientProxy (Redis or other message brokers)
    const clientProxyMock = {
      emit: jest.fn(),
    };

    // Creating the testing module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: 'NOTIFICATION_SERVICE', useValue: clientProxyMock },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    clientProxy = module.get<ClientProxy>('NOTIFICATION_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user and emit user_created event', async () => {
    // Spy on the emit method of the ClientProxy to track the event emission
    const emitSpy = jest.spyOn(clientProxy, 'emit');

    // Call the create method of the controller
    const result = await controller.create({ name: 'John Doe', email: 'john.doe@example.com' });

    // Assert the user creation
    expect(result).toEqual(mockUser);

    // Assert that the emit method was called with 'user_created' event
    expect(emitSpy).toHaveBeenCalledWith('user_created', mockUser);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should get a user by id', async () => {
    // Spy on the findOne method of the UserService
    const findOneSpy = jest.spyOn(service, 'findOne');

    // Call the findOne method
    const result = await controller.findOne(123);

    // Assert that the findOne method was called with the correct ID
    expect(findOneSpy).toHaveBeenCalledWith(123);
    expect(result).toEqual(mockUser);
  });

  it('should update a user by id', async () => {
    // Spy on the update method of the UserService
    const updateSpy = jest.spyOn(service, 'update');

    // Call the update method
    const result = await controller.update(123, { name: 'Jane Doe' });

    // Assert that the update method was called with the correct data
    expect(updateSpy).toHaveBeenCalledWith(123, { name: 'Jane Doe' });
    expect(result).toEqual(mockUser);
  });

  it('should delete a user by id', async () => {
    // Spy on the delete method of the UserService
    const deleteSpy = jest.spyOn(service, 'delete');

    // Call the delete method
    const result = await controller.delete(123);

    // Assert that the delete method was called with the correct ID
    expect(deleteSpy).toHaveBeenCalledWith(123);
    expect(result).toBe(true);
  });
});
