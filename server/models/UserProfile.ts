import db from '../database/connection';

export interface UserProfile {
  id: number;
  user_id: number;
  bio?: string;
  location_lat?: number;
  location_lng?: number;
  address?: string;
  certifications?: string; // JSON string
  activity_history?: string; // JSON string
  social_links?: string; // JSON string
  created_at: string;
  updated_at: string;
}

export interface CreateUserProfileData {
  user_id: number;
  bio?: string;
  location_lat?: number;
  location_lng?: number;
  address?: string;
  certifications?: any[];
  activity_history?: any[];
  social_links?: any;
}

export interface UpdateUserProfileData {
  bio?: string;
  location_lat?: number;
  location_lng?: number;
  address?: string;
  certifications?: any[];
  activity_history?: any[];
  social_links?: any;
}

export class UserProfileModel {
  // UC-02: Hồ sơ người dùng
  static async create(profileData: CreateUserProfileData): Promise<UserProfile> {
    const { certifications, activity_history, social_links, ...data } = profileData;
    
    const stmt = db.prepare(`
      INSERT INTO user_profiles (user_id, bio, location_lat, location_lng, address, certifications, activity_history, social_links)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      data.user_id,
      data.bio || null,
      data.location_lat || null,
      data.location_lng || null,
      data.address || null,
      certifications ? JSON.stringify(certifications) : null,
      activity_history ? JSON.stringify(activity_history) : null,
      social_links ? JSON.stringify(social_links) : null
    );
    
    return this.findById(result.lastInsertRowid as number);
  }

  static async findById(id: number): Promise<UserProfile | null> {
    const stmt = db.prepare('SELECT * FROM user_profiles WHERE id = ?');
    return stmt.get(id) as UserProfile | null;
  }

  static async findByUserId(userId: number): Promise<UserProfile | null> {
    const stmt = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?');
    return stmt.get(userId) as UserProfile | null;
  }

  static async update(userId: number, profileData: UpdateUserProfileData): Promise<UserProfile | null> {
    const { certifications, activity_history, social_links, ...data } = profileData;
    
    const fields = Object.keys(data).filter(key => data[key as keyof typeof data] !== undefined);
    const values = fields.map(field => data[field as keyof typeof data]);
    
    // Add JSON fields if provided
    if (certifications !== undefined) {
      fields.push('certifications');
      values.push(JSON.stringify(certifications));
    }
    if (activity_history !== undefined) {
      fields.push('activity_history');
      values.push(JSON.stringify(activity_history));
    }
    if (social_links !== undefined) {
      fields.push('social_links');
      values.push(JSON.stringify(social_links));
    }
    
    if (fields.length === 0) return this.findByUserId(userId);
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const stmt = db.prepare(`
      UPDATE user_profiles 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ?
    `);
    
    stmt.run(...values, userId);
    return this.findByUserId(userId);
  }

  static async delete(userId: number): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM user_profiles WHERE user_id = ?');
    const result = stmt.run(userId);
    return result.changes > 0;
  }

  static async getAll(limit: number = 50, offset: number = 0): Promise<UserProfile[]> {
    const stmt = db.prepare('SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(limit, offset) as UserProfile[];
  }

  // Helper methods to parse JSON fields
  static parseProfile(profile: UserProfile): UserProfile {
    return {
      ...profile,
      certifications: profile.certifications ? JSON.parse(profile.certifications) : null,
      activity_history: profile.activity_history ? JSON.parse(profile.activity_history) : null,
      social_links: profile.social_links ? JSON.parse(profile.social_links) : null,
    };
  }
}
