import { db } from '../database/simple-db';

export interface Product {
  id: number;
  user_id: number;
  season_id?: number;
  product_name: string;
  product_type: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  currency: string;
  harvest_date: string;
  expiry_date?: string;
  location_address: string;
  location_lat?: number;
  location_lng?: number;
  quality_standards: string[];
  certifications: string[];
  description?: string;
  images: string[];
  status: 'available' | 'reserved' | 'sold' | 'expired';
  blockchain_hash?: string; // Added for UC-30
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  user_id: number;
  season_id?: number;
  product_name: string;
  product_type: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  currency: string;
  harvest_date: string;
  expiry_date?: string;
  location_address: string;
  location_lat?: number;
  location_lng?: number;
  quality_standards?: string[];
  certifications?: string[];
  description?: string;
  images?: string[];
  status?: 'available' | 'reserved' | 'sold' | 'expired';
}

export interface UpdateProductData {
  product_name?: string;
  product_type?: string;
  quantity?: number;
  unit?: string;
  price_per_unit?: number;
  currency?: string;
  harvest_date?: string;
  expiry_date?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
  quality_standards?: string[];
  certifications?: string[];
  description?: string;
  images?: string[];
  status?: 'available' | 'reserved' | 'sold' | 'expired';
  blockchain_hash?: string; // Added for UC-30
}

export class ProductModel {
  static async create(productData: CreateProductData): Promise<Product> {
    const newProduct: Product = {
      id: Date.now(), // Simple ID generation
      user_id: productData.user_id,
      season_id: productData.season_id,
      product_name: productData.product_name,
      product_type: productData.product_type,
      quantity: productData.quantity,
      unit: productData.unit,
      price_per_unit: productData.price_per_unit,
      currency: productData.currency,
      harvest_date: productData.harvest_date,
      expiry_date: productData.expiry_date,
      location_address: productData.location_address,
      location_lat: productData.location_lat,
      location_lng: productData.location_lng,
      quality_standards: productData.quality_standards || [],
      certifications: productData.certifications || [],
      description: productData.description,
      images: productData.images || [],
      status: productData.status || 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to database
    if (!db.products) {
      db.products = [];
    }
    db.products.push(newProduct);
    
    // Save to file
    db.saveDatabase();

    return newProduct;
  }

  static async findById(id: number): Promise<Product | null> {
    if (!db.products) return null;
    return db.products.find(product => product.id === id) || null;
  }

  static async findByUserId(userId: number): Promise<Product[]> {
    if (!db.products) return [];
    return db.products.filter(product => product.user_id === userId);
  }

  static async findBySeasonId(seasonId: number): Promise<Product[]> {
    if (!db.products) return [];
    return db.products.filter(product => product.season_id === seasonId);
  }

  static async findAvailable(): Promise<Product[]> {
    if (!db.products) return [];
    return db.products.filter(product => product.status === 'available');
  }

  static async update(id: number, productData: UpdateProductData): Promise<Product | null> {
    if (!db.products) return null;
    
    const productIndex = db.products.findIndex(product => product.id === id);
    if (productIndex === -1) return null;

    const updatedProduct = {
      ...db.products[productIndex],
      ...productData,
      updated_at: new Date().toISOString(),
    };

    db.products[productIndex] = updatedProduct;
    
    // Save to file
    db.saveDatabase();

    return updatedProduct;
  }

  static async delete(id: number): Promise<boolean> {
    if (!db.products) return false;
    
    const productIndex = db.products.findIndex(product => product.id === id);
    if (productIndex === -1) return false;

    db.products.splice(productIndex, 1);
    
    // Save to file
    db.saveDatabase();

    return true;
  }

  static async getAll(limit: number = 50, offset: number = 0): Promise<Product[]> {
    if (!db.products) return [];
    return db.products.slice(offset, offset + limit);
  }
}
