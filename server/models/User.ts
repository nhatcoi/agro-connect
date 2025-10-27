import db from '../database/connection';
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
  // UC-01: Đăng ký tài khoản
  static async create(userData: CreateUserData): Promise<User> {
    const { password, ...data } = userData;
    const password_hash = await bcrypt.hash(password, 10);
    
    const stmt = db.prepare(`
      INSERT INTO users (email, phone, password_hash, role, full_name, avatar_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      data.email,
      data.phone || null,
      password_hash,
      data.role,
      data.full_name,
      data.avatar_url || null
    );
    
    return this.findById(result.lastInsertRowid as number);
  }

  static async findById(id: number): Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | null;
  }

  static async findByPhone(phone: string): Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE phone = ?');
    return stmt.get(phone) as User | null;
  }

  static async update(id: number, userData: UpdateUserData): Promise<User | null> {
    const fields = Object.keys(userData).filter(key => userData[key as keyof UpdateUserData] !== undefined);
    const values = fields.map(field => userData[field as keyof UpdateUserData]);
    
    if (fields.length === 0) return this.findById(id);
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const stmt = db.prepare(`
      UPDATE users 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run(...values, id);
    return this.findById(id);
  }

  static async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password_hash);
    return isValid ? user : null;
  }

  static async getAll(limit: number = 50, offset: number = 0): Promise<User[]> {
    const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(limit, offset) as User[];
  }

  static async getByRole(role: string, limit: number = 50, offset: number = 0): Promise<User[]> {
    const stmt = db.prepare('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(role, limit, offset) as User[];
  }

  static async delete(id: number): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
