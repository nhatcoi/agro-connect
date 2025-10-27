import db from '../database/connection';

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
  // UC-03: Xác thực ESG ID
  static async create(verificationData: CreateESGVerificationData): Promise<ESGVerification> {
    const stmt = db.prepare(`
      INSERT INTO esg_verifications (user_id, verification_notes)
      VALUES (?, ?)
    `);
    
    const result = stmt.run(
      verificationData.user_id,
      verificationData.verification_notes || null
    );
    
    return this.findById(result.lastInsertRowid as number);
  }

  static async findById(id: number): Promise<ESGVerification | null> {
    const stmt = db.prepare('SELECT * FROM esg_verifications WHERE id = ?');
    return stmt.get(id) as ESGVerification | null;
  }

  static async findByUserId(userId: number): Promise<ESGVerification | null> {
    const stmt = db.prepare('SELECT * FROM esg_verifications WHERE user_id = ?');
    return stmt.get(userId) as ESGVerification | null;
  }

  static async findByESGId(esgId: string): Promise<ESGVerification | null> {
    const stmt = db.prepare('SELECT * FROM esg_verifications WHERE esg_id = ?');
    return stmt.get(esgId) as ESGVerification | null;
  }

  static async update(id: number, verificationData: UpdateESGVerificationData): Promise<ESGVerification | null> {
    const fields = Object.keys(verificationData).filter(key => verificationData[key as keyof UpdateESGVerificationData] !== undefined);
    const values = fields.map(field => verificationData[field as keyof UpdateESGVerificationData]);
    
    if (fields.length === 0) return this.findById(id);
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const stmt = db.prepare(`
      UPDATE esg_verifications 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run(...values, id);
    return this.findById(id);
  }

  static async approve(id: number, verifiedBy: number, esgId: string, esgScore: number, notes?: string): Promise<ESGVerification | null> {
    const stmt = db.prepare(`
      UPDATE esg_verifications 
      SET esg_id = ?, verification_status = 'approved', verified_by = ?, 
          verification_date = CURRENT_TIMESTAMP, esg_score = ?, verification_notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(esgId, verifiedBy, esgScore, notes || null, id);
    return this.findById(id);
  }

  static async reject(id: number, verifiedBy: number, notes?: string): Promise<ESGVerification | null> {
    const stmt = db.prepare(`
      UPDATE esg_verifications 
      SET verification_status = 'rejected', verified_by = ?, 
          verification_date = CURRENT_TIMESTAMP, verification_notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(verifiedBy, notes || null, id);
    return this.findById(id);
  }

  static async getAll(limit: number = 50, offset: number = 0): Promise<ESGVerification[]> {
    const stmt = db.prepare('SELECT * FROM esg_verifications ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(limit, offset) as ESGVerification[];
  }

  static async getPending(limit: number = 50, offset: number = 0): Promise<ESGVerification[]> {
    const stmt = db.prepare('SELECT * FROM esg_verifications WHERE verification_status = "pending" ORDER BY created_at DESC LIMIT ? OFFSET ?');
    return stmt.all(limit, offset) as ESGVerification[];
  }

  static async delete(id: number): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM esg_verifications WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Generate unique ESG ID
  static generateESGId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ESG-${timestamp}-${random}`.toUpperCase();
  }
}

export class ESGScoreDetailsModel {
  static async create(scoreData: CreateESGScoreData): Promise<ESGScoreDetails> {
    const stmt = db.prepare(`
      INSERT INTO esg_score_details (
        esg_verification_id, environment_score, social_score, governance_score,
        co2_emissions, water_usage, waste_management_score, gender_equality_score,
        safety_score, community_participation_score, data_transparency_score,
        legal_compliance_score, traceability_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      scoreData.esg_verification_id,
      scoreData.environment_score || 0,
      scoreData.social_score || 0,
      scoreData.governance_score || 0,
      scoreData.co2_emissions || null,
      scoreData.water_usage || null,
      scoreData.waste_management_score || null,
      scoreData.gender_equality_score || null,
      scoreData.safety_score || null,
      scoreData.community_participation_score || null,
      scoreData.data_transparency_score || null,
      scoreData.legal_compliance_score || null,
      scoreData.traceability_score || null
    );
    
    return this.findById(result.lastInsertRowid as number);
  }

  static async findById(id: number): Promise<ESGScoreDetails | null> {
    const stmt = db.prepare('SELECT * FROM esg_score_details WHERE id = ?');
    return stmt.get(id) as ESGScoreDetails | null;
  }

  static async findByVerificationId(verificationId: number): Promise<ESGScoreDetails | null> {
    const stmt = db.prepare('SELECT * FROM esg_score_details WHERE esg_verification_id = ?');
    return stmt.get(verificationId) as ESGScoreDetails | null;
  }

  static async update(id: number, scoreData: Partial<CreateESGScoreData>): Promise<ESGScoreDetails | null> {
    const fields = Object.keys(scoreData).filter(key => scoreData[key as keyof typeof scoreData] !== undefined);
    const values = fields.map(field => scoreData[field as keyof typeof scoreData]);
    
    if (fields.length === 0) return this.findById(id);
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const stmt = db.prepare(`
      UPDATE esg_score_details 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    stmt.run(...values, id);
    return this.findById(id);
  }
}
