// src/user.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() userData: { name: string; email: string }) {
    const user = this.userService.create(userData);
    // Emit event here using the client proxy
    this.client.emit('user_created', user);
    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() userData: { name?: string; email?: string }) {
    return this.userService.update(id, userData);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
