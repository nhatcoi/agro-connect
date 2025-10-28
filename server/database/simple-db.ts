import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'agroconnect.json');

interface Database {
  users: User[];
  userProfiles: UserProfile[];
  esgVerifications: ESGVerification[];
  esgScoreDetails: ESGScoreDetails[];
  userSessions: UserSession[];
  seasons: Season[];
  images: Image[];
  products: Product[];
  orders: Order[];
}

interface User {
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

interface UserProfile {
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

interface ESGVerification {
  id: number;
  user_id: number;
  esg_id?: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  verified_by?: number;
  verification_date?: string;
  verification_notes?: string;
  esg_score?: number;
  created_at: string;
  updated_at: string;
}

interface ESGScoreDetails {
  id: number;
  esg_verification_id: number;
  environment_score: number;
  social_score: number;
  governance_score: number;
  co2_emissions?: number;
  water_usage?: number;
  waste_management_score?: number;
  gender_equality_score?: number;
  safety_score?: number;
  community_participation_score?: number;
  data_transparency_score?: number;
  legal_compliance_score?: number;
  traceability_score?: number;
  created_at: string;
  updated_at: string;
}

interface UserSession {
  id: number;
  user_id: number;
  session_token: string;
  expires_at: string;
  created_at: string;
}

interface Season {
  id: number;
  user_id: number;
  season_name: string;
  crop_type: string;
  planting_date: string;
  expected_harvest_date: string;
  area_size: number;
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

interface Image {
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

interface Product {
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

interface Order {
  id: number;
  order_number: string;
  farmer_id: number;
  business_id: number;
  product_id: number;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_amount: number;
  currency: string;
  status: 'pending' | 'negotiating' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  delivery_address: string;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_date?: string;
  notes?: string;
  contract_url?: string;
  qr_code?: string;
  blockchain_hash?: string;
  created_at: string;
  updated_at: string;
}


class SimpleDB {
  private db: Database;

  constructor() {
    this.db = this.loadDatabase();
  }

  private loadDatabase(): Database {
    try {
      if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }

    return {
      users: [],
      userProfiles: [],
      esgVerifications: [],
      esgScoreDetails: [],
      userSessions: [],
      seasons: [],
      images: [],
      products: [],
      orders: []
    };
  }

  private saveDatabase(): void {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(this.db, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  private getNextId(collection: keyof Database): number {
    const items = this.db[collection] as any[];
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }

  // User methods
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const user: User = {
      ...userData,
      id: this.getNextId('users'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.db.users.push(user);
    this.saveDatabase();
    return user;
  }

  async findUserById(id: number): Promise<User | null> {
    return this.db.users.find(user => user.id === id) || null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.db.users.find(user => user.email === email) || null;
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    return this.db.users.find(user => user.phone === phone) || null;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const userIndex = this.db.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.db.users[userIndex] = {
      ...this.db.users[userIndex],
      ...userData,
      updated_at: new Date().toISOString()
    };

    this.saveDatabase();
    return this.db.users[userIndex];
  }

  async verifyUserPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    return isValid ? user : null;
  }

  async getAllUsers(limit: number = 50, offset: number = 0): Promise<User[]> {
    return this.db.users.slice(offset, offset + limit);
  }

  async getUsersByRole(role: string, limit: number = 50, offset: number = 0): Promise<User[]> {
    return this.db.users
      .filter(user => user.role === role)
      .slice(offset, offset + limit);
  }

  // UserProfile methods
  async createUserProfile(profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    const profile: UserProfile = {
      ...profileData,
      id: this.getNextId('userProfiles'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.db.userProfiles.push(profile);
    this.saveDatabase();
    return profile;
  }

  async findUserProfileById(id: number): Promise<UserProfile | null> {
    return this.db.userProfiles.find(profile => profile.id === id) || null;
  }

  async findUserProfileByUserId(userId: number): Promise<UserProfile | null> {
    return this.db.userProfiles.find(profile => profile.user_id === userId) || null;
  }

  async updateUserProfile(userId: number, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    const profileIndex = this.db.userProfiles.findIndex(profile => profile.user_id === userId);
    if (profileIndex === -1) return null;

    this.db.userProfiles[profileIndex] = {
      ...this.db.userProfiles[profileIndex],
      ...profileData,
      updated_at: new Date().toISOString()
    };

    this.saveDatabase();
    return this.db.userProfiles[profileIndex];
  }

  // ESG Verification methods
  async createESGVerification(verificationData: Omit<ESGVerification, 'id' | 'created_at' | 'updated_at'>): Promise<ESGVerification> {
    const verification: ESGVerification = {
      ...verificationData,
      id: this.getNextId('esgVerifications'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.db.esgVerifications.push(verification);
    this.saveDatabase();
    return verification;
  }

  async findESGVerificationById(id: number): Promise<ESGVerification | null> {
    return this.db.esgVerifications.find(verification => verification.id === id) || null;
  }

  async findESGVerificationByUserId(userId: number): Promise<ESGVerification | null> {
    return this.db.esgVerifications.find(verification => verification.user_id === userId) || null;
  }

  async findESGVerificationByESGId(esgId: string): Promise<ESGVerification | null> {
    return this.db.esgVerifications.find(verification => verification.esg_id === esgId) || null;
  }

  async updateESGVerification(id: number, verificationData: Partial<ESGVerification>): Promise<ESGVerification | null> {
    const verificationIndex = this.db.esgVerifications.findIndex(verification => verification.id === id);
    if (verificationIndex === -1) return null;

    this.db.esgVerifications[verificationIndex] = {
      ...this.db.esgVerifications[verificationIndex],
      ...verificationData,
      updated_at: new Date().toISOString()
    };

    this.saveDatabase();
    return this.db.esgVerifications[verificationIndex];
  }

  async getPendingESGVerifications(limit: number = 50, offset: number = 0): Promise<ESGVerification[]> {
    return this.db.esgVerifications
      .filter(verification => verification.verification_status === 'pending')
      .slice(offset, offset + limit);
  }

  generateESGId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ESG-${timestamp}-${random}`.toUpperCase();
  }

  // Session methods
  async createSession(userId: number, expiresInHours: number = 24): Promise<UserSession> {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    
    const session: UserSession = {
      id: this.getNextId('userSessions'),
      user_id: userId,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    };
    
    this.db.userSessions.push(session);
    this.saveDatabase();
    return session;
  }

  async findSessionByToken(token: string): Promise<UserSession | null> {
    const session = this.db.userSessions.find(s => s.session_token === token);
    if (!session) return null;

    // Check if session is expired
    if (new Date(session.expires_at) <= new Date()) {
      await this.deleteSessionByToken(token);
      return null;
    }

    return session;
  }

  async deleteSessionByToken(token: string): Promise<boolean> {
    const initialLength = this.db.userSessions.length;
    this.db.userSessions = this.db.userSessions.filter(s => s.session_token !== token);
    this.saveDatabase();
    return this.db.userSessions.length < initialLength;
  }

  async deleteSessionByUserId(userId: number): Promise<boolean> {
    const initialLength = this.db.userSessions.length;
    this.db.userSessions = this.db.userSessions.filter(s => s.user_id !== userId);
    this.saveDatabase();
    return this.db.userSessions.length < initialLength;
  }

  // Product methods
  async findProductsByUserId(userId: number): Promise<any[]> {
    return this.db.products.filter(product => product.user_id === userId);
  }

  async getAvailableProducts(limit: number = 20, offset: number = 0): Promise<any[]> {
    return this.db.products
      .filter(product => product.status === 'available')
      .slice(offset, offset + limit);
  }

  // Order methods
  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const order: Order = {
      ...orderData,
      id: this.getNextId('orders'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.db.orders.push(order);
    this.saveDatabase();
    return order;
  }

  async findOrderById(id: number): Promise<Order | null> {
    return this.db.orders.find(order => order.id === id) || null;
  }

  async findOrdersByFarmerId(farmerId: number): Promise<Order[]> {
    return this.db.orders.filter(order => order.farmer_id === farmerId);
  }

  async findOrdersByBusinessId(businessId: number): Promise<Order[]> {
    return this.db.orders.filter(order => order.business_id === businessId);
  }

  async findOrdersByUserId(userId: number): Promise<Order[]> {
    return this.db.orders.filter(order => order.farmer_id === userId || order.business_id === userId);
  }

  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order | null> {
    const orderIndex = this.db.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return null;

    this.db.orders[orderIndex] = {
      ...this.db.orders[orderIndex],
      ...orderData,
      updated_at: new Date().toISOString()
    };

    this.saveDatabase();
    return this.db.orders[orderIndex];
  }

  async deleteOrder(id: number): Promise<boolean> {
    const initialLength = this.db.orders.length;
    this.db.orders = this.db.orders.filter(order => order.id !== id);
    this.saveDatabase();
    return this.db.orders.length < initialLength;
  }

  async getAllOrders(limit: number = 50, offset: number = 0): Promise<Order[]> {
    return this.db.orders.slice(offset, offset + limit);
  }

  async findOrdersByStatus(status: string): Promise<Order[]> {
    return this.db.orders.filter(order => order.status === status);
  }

  generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }
}

export const db = new SimpleDB();
export default db;
