import { db } from '../database/simple-db';

export interface Season {
  id: number;
  user_id: number;
  season_name: string;
  crop_type: string;
  planting_date: string;
  expected_harvest_date: string;
  area_size: number; // in hectares
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  fertilizers: string[];
  pesticides: string[];
  notes?: string;
  status: 'planning' | 'planting' | 'growing' | 'harvesting' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface CreateSeasonData {
  user_id: number;
  season_name: string;
  crop_type: string;
  planting_date: string;
  expected_harvest_date: string;
  area_size: number;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  fertilizers?: string[];
  pesticides?: string[];
  notes?: string;
  status?: 'planning' | 'planting' | 'growing' | 'harvesting' | 'completed';
}

export interface UpdateSeasonData {
  season_name?: string;
  crop_type?: string;
  planting_date?: string;
  expected_harvest_date?: string;
  area_size?: number;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  fertilizers?: string[];
  pesticides?: string[];
  notes?: string;
  status?: 'planning' | 'planting' | 'growing' | 'harvesting' | 'completed';
}

export class SeasonModel {
  static async create(seasonData: CreateSeasonData): Promise<Season> {
    const newSeason: Season = {
      id: Date.now(), // Simple ID generation
      user_id: seasonData.user_id,
      season_name: seasonData.season_name,
      crop_type: seasonData.crop_type,
      planting_date: seasonData.planting_date,
      expected_harvest_date: seasonData.expected_harvest_date,
      area_size: seasonData.area_size,
      location_lat: seasonData.location_lat,
      location_lng: seasonData.location_lng,
      location_address: seasonData.location_address,
      fertilizers: seasonData.fertilizers || [],
      pesticides: seasonData.pesticides || [],
      notes: seasonData.notes,
      status: seasonData.status || 'planning',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to database
    if (!db.seasons) {
      db.seasons = [];
    }
    db.seasons.push(newSeason);
    
    // Save to file
    db.saveDatabase();

    return newSeason;
  }

  static async findById(id: number): Promise<Season | null> {
    if (!db.seasons) return null;
    return db.seasons.find(season => season.id === id) || null;
  }

  static async findByUserId(userId: number): Promise<Season[]> {
    if (!db.seasons) return [];
    return db.seasons.filter(season => season.user_id === userId);
  }

  static async update(id: number, seasonData: UpdateSeasonData): Promise<Season | null> {
    if (!db.seasons) return null;
    
    const seasonIndex = db.seasons.findIndex(season => season.id === id);
    if (seasonIndex === -1) return null;

    const updatedSeason = {
      ...db.seasons[seasonIndex],
      ...seasonData,
      updated_at: new Date().toISOString(),
    };

    db.seasons[seasonIndex] = updatedSeason;
    
    // Save to file
    db.saveDatabase();

    return updatedSeason;
  }

  static async delete(id: number): Promise<boolean> {
    if (!db.seasons) return false;
    
    const seasonIndex = db.seasons.findIndex(season => season.id === id);
    if (seasonIndex === -1) return false;

    db.seasons.splice(seasonIndex, 1);
    
    // Save to file
    db.saveDatabase();

    return true;
  }

  static async getAll(limit: number = 50, offset: number = 0): Promise<Season[]> {
    if (!db.seasons) return [];
    return db.seasons.slice(offset, offset + limit);
  }
}
