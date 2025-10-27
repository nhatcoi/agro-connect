import { db } from '../database/simple-db';

export interface Image {
  id: number;
  user_id: number;
  season_id?: number;
  image_url: string;
  image_type: 'crop' | 'field' | 'certificate' | 'diary' | 'other';
  title: string;
  description?: string;
  tags: string[];
  location_lat?: number;
  location_lng?: number;
  taken_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateImageData {
  user_id: number;
  season_id?: number;
  image_url: string;
  image_type: 'crop' | 'field' | 'certificate' | 'diary' | 'other';
  title: string;
  description?: string;
  tags?: string[];
  location_lat?: number;
  location_lng?: number;
  taken_date: string;
}

export interface UpdateImageData {
  image_url?: string;
  image_type?: 'crop' | 'field' | 'certificate' | 'diary' | 'other';
  title?: string;
  description?: string;
  tags?: string[];
  location_lat?: number;
  location_lng?: number;
  taken_date?: string;
}

export class ImageModel {
  static async create(imageData: CreateImageData): Promise<Image> {
    const newImage: Image = {
      id: Date.now(), // Simple ID generation
      user_id: imageData.user_id,
      season_id: imageData.season_id,
      image_url: imageData.image_url,
      image_type: imageData.image_type,
      title: imageData.title,
      description: imageData.description,
      tags: imageData.tags || [],
      location_lat: imageData.location_lat,
      location_lng: imageData.location_lng,
      taken_date: imageData.taken_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to database
    if (!db.images) {
      db.images = [];
    }
    db.images.push(newImage);
    
    // Save to file
    db.saveDatabase();

    return newImage;
  }

  static async findById(id: number): Promise<Image | null> {
    if (!db.images) return null;
    return db.images.find(image => image.id === id) || null;
  }

  static async findByUserId(userId: number): Promise<Image[]> {
    if (!db.images) return [];
    return db.images.filter(image => image.user_id === userId);
  }

  static async findBySeasonId(seasonId: number): Promise<Image[]> {
    if (!db.images) return [];
    return db.images.filter(image => image.season_id === seasonId);
  }

  static async update(id: number, imageData: UpdateImageData): Promise<Image | null> {
    if (!db.images) return null;
    
    const imageIndex = db.images.findIndex(image => image.id === id);
    if (imageIndex === -1) return null;

    const updatedImage = {
      ...db.images[imageIndex],
      ...imageData,
      updated_at: new Date().toISOString(),
    };

    db.images[imageIndex] = updatedImage;
    
    // Save to file
    db.saveDatabase();

    return updatedImage;
  }

  static async delete(id: number): Promise<boolean> {
    if (!db.images) return false;
    
    const imageIndex = db.images.findIndex(image => image.id === id);
    if (imageIndex === -1) return false;

    db.images.splice(imageIndex, 1);
    
    // Save to file
    db.saveDatabase();

    return true;
  }

  static async getAll(limit: number = 50, offset: number = 0): Promise<Image[]> {
    if (!db.images) return [];
    return db.images.slice(offset, offset + limit);
  }
}
