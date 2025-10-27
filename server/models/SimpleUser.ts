import { db } from '../database/simple-db';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  phone?: string;
  password_hash: string;
  role: 'farmer' | 'business' | 'consumer' | 'esg_expert';
  full_name: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  phone?: string;
  password: string;
  role: 'farmer' | 'business' | 'consumer' | 'esg_expert';
  full_name: string;
  avatar_url?: string;
}

export interface UpdateUserData {
  email?: string;
  phone?: string;
  full_name?: string;
  avatar_url?: string;
  is_active?: boolean;
  is_verified?: boolean;
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    const { password, ...data } = userData;
    const password_hash = await bcrypt.hash(password, 10);
    
    return await db.createUser({
      ...data,
      password_hash,
      is_active: true,
      is_verified: false
    });
  }

  static async findById(id: number): Promise<User | null> {
    return await db.findUserById(id);
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await db.findUserByEmail(email);
  }

  static async findByPhone(phone: string): Promise<User | null> {
    return await db.findUserByPhone(phone);
  }

  static async update(id: number, userData: UpdateUserData): Promise<User | null> {
    return await db.updateUser(id, userData);
  }

  static async verifyPassword(email: string, password: string): Promise<User | null> {
    return await db.verifyUserPassword(email, password);
  }

  static async getAll(limit: number = 50, offset: number = 0): Promise<User[]> {
    return await db.getAllUsers(limit, offset);
  }

  static async getByRole(role: string, limit: number = 50, offset: number = 0): Promise<User[]> {
    return await db.getUsersByRole(role, limit, offset);
  }

  static async delete(id: number): Promise<boolean> {
    // Simple implementation - in real app would need to handle cascading deletes
    return false;
  }
}
