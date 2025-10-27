import { db } from '../database/simple-db';

export interface UserProfile {
  id: number;
  user_id: number;
  bio?: string;
  location_lat?: number;
  location_lng?: number;
  address?: string;
  certifications?: any[];
  activity_history?: any[];
  social_links?: any;
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
  static async create(profileData: CreateUserProfileData): Promise<UserProfile> {
    return await db.createUserProfile(profileData);
  }

  static async findById(id: number): Promise<UserProfile | null> {
    return await db.findUserProfileById(id);
  }

  static async findByUserId(userId: number): Promise<UserProfile | null> {
    return await db.findUserProfileByUserId(userId);
  }

  static async update(userId: number, profileData: UpdateUserProfileData): Promise<UserProfile | null> {
    return await db.updateUserProfile(userId, profileData);
  }

  static async delete(userId: number): Promise<boolean> {
    // Simple implementation
    return false;
  }

  static async getAll(limit: number = 50, offset: number = 0): Promise<UserProfile[]> {
    // Simple implementation
    return [];
  }

  static parseProfile(profile: UserProfile): UserProfile {
    return {
      ...profile,
      certifications: profile.certifications || [],
      activity_history: profile.activity_history || [],
      social_links: profile.social_links || {}
    };
  }
}
