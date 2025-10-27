import db from '../database/connection';
import crypto from 'crypto';

export interface UserSession {
  id: number;
  user_id: number;
  session_token: string;
  expires_at: string;
  created_at: string;
}

export class SessionModel {
  static async create(userId: number, expiresInHours: number = 24): Promise<UserSession> {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    
    const stmt = db.prepare(`
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `);
    
    const result = stmt.run(userId, sessionToken, expiresAt.toISOString());
    
    return this.findById(result.lastInsertRowid as number);
  }

  static async findById(id: number): Promise<UserSession | null> {
    const stmt = db.prepare('SELECT * FROM user_sessions WHERE id = ?');
    return stmt.get(id) as UserSession | null;
  }

  static async findByToken(token: string): Promise<UserSession | null> {
    const stmt = db.prepare('SELECT * FROM user_sessions WHERE session_token = ? AND expires_at > CURRENT_TIMESTAMP');
    return stmt.get(token) as UserSession | null;
  }

  static async deleteByToken(token: string): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM user_sessions WHERE session_token = ?');
    const result = stmt.run(token);
    return result.changes > 0;
  }

  static async deleteByUserId(userId: number): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM user_sessions WHERE user_id = ?');
    const result = stmt.run(userId);
    return result.changes > 0;
  }

  static async deleteExpired(): Promise<number> {
    const stmt = db.prepare('DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP');
    const result = stmt.run();
    return result.changes;
  }

  static async extendSession(token: string, expiresInHours: number = 24): Promise<UserSession | null> {
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    
    const stmt = db.prepare(`
      UPDATE user_sessions 
      SET expires_at = ? 
      WHERE session_token = ? AND expires_at > CURRENT_TIMESTAMP
    `);
    
    const result = stmt.run(expiresAt.toISOString(), token);
    
    if (result.changes > 0) {
      return this.findByToken(token);
    }
    
    return null;
  }
}
