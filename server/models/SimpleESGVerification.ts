import { db } from '../database/simple-db';

export interface ESGVerification {
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

export interface ESGScoreDetails {
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

export interface CreateESGVerificationData {
  user_id: number;
  verification_notes?: string;
}

export interface UpdateESGVerificationData {
  esg_id?: string;
  verification_status?: 'pending' | 'approved' | 'rejected';
  verified_by?: number;
  verification_notes?: string;
  esg_score?: number;
}

export interface CreateESGScoreData {
  esg_verification_id: number;
  environment_score?: number;
  social_score?: number;
  governance_score?: number;
  co2_emissions?: number;
  water_usage?: number;
  waste_management_score?: number;
  gender_equality_score?: number;
  safety_score?: number;
  community_participation_score?: number;
  data_transparency_score?: number;
  legal_compliance_score?: number;
  traceability_score?: number;
}

export class ESGVerificationModel {
  static async create(verificationData: CreateESGVerificationData): Promise<ESGVerification> {
    return await db.createESGVerification({
      ...verificationData,
      verification_status: 'pending'
    });
  }

  static async findById(id: number): Promise<ESGVerification | null> {
    return await db.findESGVerificationById(id);
  }

  static async findByUserId(userId: number): Promise<ESGVerification | null> {
    return await db.findESGVerificationByUserId(userId);
  }

  static async findByESGId(esgId: string): Promise<ESGVerification | null> {
    return await db.findESGVerificationByESGId(esgId);
  }

  static async update(id: number, verificationData: UpdateESGVerificationData): Promise<ESGVerification | null> {
    return await db.updateESGVerification(id, verificationData);
  }

  static async approve(id: number, verifiedBy: number, esgId: string, esgScore: number, notes?: string): Promise<ESGVerification | null> {
    return await db.updateESGVerification(id, {
      esg_id: esgId,
      verification_status: 'approved',
      verified_by: verifiedBy,
      verification_date: new Date().toISOString(),
      esg_score: esgScore,
      verification_notes: notes
    });
  }

  static async reject(id: number, verifiedBy: number, notes?: string): Promise<ESGVerification | null> {
    return await db.updateESGVerification(id, {
      verification_status: 'rejected',
      verified_by: verifiedBy,
      verification_date: new Date().toISOString(),
      verification_notes: notes
    });
  }

  static async getAll(limit: number = 50, offset: number = 0): Promise<ESGVerification[]> {
    // Simple implementation
    return [];
  }

  static async getPending(limit: number = 50, offset: number = 0): Promise<ESGVerification[]> {
    return await db.getPendingESGVerifications(limit, offset);
  }

  static async delete(id: number): Promise<boolean> {
    // Simple implementation
    return false;
  }

  static generateESGId(): string {
    return db.generateESGId();
  }
}

export class ESGScoreDetailsModel {
  static async create(scoreData: CreateESGScoreData): Promise<ESGScoreDetails> {
    // Simple implementation - would need to add to simple-db
    throw new Error('Not implemented in simple version');
  }

  static async findById(id: number): Promise<ESGScoreDetails | null> {
    // Simple implementation
    return null;
  }

  static async findByVerificationId(verificationId: number): Promise<ESGScoreDetails | null> {
    // Simple implementation
    return null;
  }

  static async update(id: number, scoreData: Partial<CreateESGScoreData>): Promise<ESGScoreDetails | null> {
    // Simple implementation
    return null;
  }
}
