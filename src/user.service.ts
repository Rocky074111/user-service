// src/user.service.ts
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];
  private nextId = 1;

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    return this.users.find(user => user.id === id);
  }

  create(userData: Partial<User>): User {
    const user = { id: this.nextId++, ...userData } as User;
    this.users.push(user);
    return user;
  }

  update(id: number, userData: Partial<User>): User {
    const user = this.findOne(id);
    if (!user) return null;
    Object.assign(user, userData);
    return user;
  }

  delete(id: number): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }
}
