import { Router, Request, Response } from 'express';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { UserModel } from '../models/SimpleUser';
import { UserProfileModel } from '../models/SimpleUserProfile';
import { ESGVerificationModel } from '../models/SimpleESGVerification';
import { db } from '../database/simple-db';

const router = Router();

// Test endpoint
router.get('/test', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Partner API is working' });
});

// Test database endpoint
router.get('/test-db', (req: Request, res: Response) => {
  try {
    const products = db.products || [];
    res.json({ 
      success: true, 
      message: 'Database test successful',
      data: { productsCount: products.length }
    });
  } catch (error) {
    res.json({ 
      success: false, 
      message: 'Database test failed',
      error: error.message 
    });
  }
});

// Test authentication endpoint
router.get('/test-auth', authenticateToken, (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    res.json({ 
      success: true, 
      message: 'Authentication test successful',
      data: { 
        userId: authReq.user.id,
        userRole: authReq.user.role,
        userEmail: authReq.user.email
      }
    });
  } catch (error) {
    res.json({ 
      success: false, 
      message: 'Authentication test failed',
      error: error.message 
    });
  }
});

// Test role-based endpoint
router.get('/test-role', authenticateToken, requireRole(['farmer']), (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    res.json({ 
      success: true, 
      message: 'Role test successful',
      data: { 
        userId: authReq.user.id,
        userRole: authReq.user.role,
        userEmail: authReq.user.email
      }
    });
  } catch (error) {
    res.json({ 
      success: false, 
      message: 'Role test failed',
      error: error.message 
    });
  }
});

// Simple suggestions endpoint for testing
router.get('/simple-suggestions', authenticateToken, requireRole(['farmer']), async (req: Request, res: Response) => {
  try {
    console.log('Simple suggestions request received');
    const authReq = req as AuthenticatedRequest;
    const farmerId = authReq.user.id;
    
    // Get farmer data
    const farmer = await UserModel.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin nông dân' });
    }

    // Get all business users
    const businesses = await UserModel.getByRole('business', 100, 0);
    
    // Simple suggestions without complex matching
    const suggestions = businesses.map(business => ({
      user_id: business.id,
      business_name: business.full_name,
      email: business.email,
      matching_score: 50, // Simple score
      matching_reasons: ['Đối tác tiềm năng']
    }));

    res.json({
      success: true,
      message: 'Gợi ý đối tác thành công',
      data: {
        suggestions: suggestions.slice(0, 5), // Limit to 5
        total: suggestions.length
      }
    });

  } catch (error) {
    console.error('Simple suggestions error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy gợi ý đối tác', error: error.message });
  }
});

// Verify user endpoint (for testing)
router.post('/verify-user', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email là bắt buộc' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }

    const updatedUser = await UserModel.update(user.id, { is_verified: true });
    
    res.json({
      success: true,
      message: 'User đã được verify',
      data: updatedUser
    });

  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi verify user' });
  }
});

// Working suggestions endpoint
router.get('/working-suggestions', authenticateToken, requireRole(['farmer']), async (req: Request, res: Response) => {
  try {
    console.log('Working suggestions request received');
    const authReq = req as AuthenticatedRequest;
    const farmerId = authReq.user.id;
    
    // Get farmer data
    const farmer = await UserModel.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin nông dân' });
    }

    // Get all business users
    const businesses = await UserModel.getByRole('business', 100, 0);
    
    const suggestions = [];
    
    for (const business of businesses) {
      // Skip if business is not verified
      if (!business.is_verified) continue;

      const businessProfile = await UserProfileModel.findByUserId(business.id);
      const businessESG = await ESGVerificationModel.findByUserId(business.id);

      // Skip if business doesn't have ESG verification or it's not approved
      if (!businessESG || businessESG.verification_status !== 'approved') continue;

      suggestions.push({
        user_id: business.id,
        business_name: business.full_name,
        email: business.email,
        esg_score: businessESG.esg_score,
        esg_id: businessESG.esg_id,
        matching_score: 70,
        matching_reasons: ['ESG đã được xác thực']
      });
    }

    res.json({
      success: true,
      message: 'Gợi ý đối tác thành công',
      data: {
        suggestions: suggestions,
        total: suggestions.length
      }
    });

  } catch (error) {
    console.error('Working suggestions error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy gợi ý đối tác', error: error.message });
  }
});

// Debug suggestions endpoint
router.get('/debug-suggestions', authenticateToken, requireRole(['farmer']), async (req: Request, res: Response) => {
  try {
    console.log('Debug suggestions request received');
    const authReq = req as AuthenticatedRequest;
    const farmerId = authReq.user.id;
    
    console.log('Step 1: Getting farmer data...');
    const farmer = await UserModel.findById(farmerId);
    if (!farmer) {
      console.log('Farmer not found');
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin nông dân' });
    }
    console.log('Farmer found:', farmer.email);

    console.log('Step 2: Getting business users...');
    const businesses = await UserModel.getByRole('business', 100, 0);
    console.log('Business users count:', businesses.length);

    console.log('Step 3: Processing businesses...');
    const suggestions = [];
    
    for (const business of businesses) {
      console.log(`Processing business: ${business.full_name}`);
      
      // Skip if business is not verified
      if (!business.is_verified) {
        console.log(`Business ${business.full_name} not verified, skipping`);
        continue;
      }

      console.log(`Getting profile for business ${business.id}...`);
      const businessProfile = await UserProfileModel.findByUserId(business.id);
      console.log(`Profile found: ${businessProfile ? 'yes' : 'no'}`);

      console.log(`Getting ESG for business ${business.id}...`);
      const businessESG = await ESGVerificationModel.findByUserId(business.id);
      console.log(`ESG found: ${businessESG ? 'yes' : 'no'}, status: ${businessESG?.verification_status}`);

      // Skip if business doesn't have ESG verification or it's not approved
      if (!businessESG || businessESG.verification_status !== 'approved') {
        console.log(`Business ${business.full_name} ESG not approved, skipping`);
        continue;
      }

      console.log(`Adding business ${business.full_name} to suggestions`);
      suggestions.push({
        user_id: business.id,
        business_name: business.full_name,
        email: business.email,
        esg_score: businessESG.esg_score,
        esg_id: businessESG.esg_id,
        matching_score: 70,
        matching_reasons: ['ESG đã được xác thực']
      });
    }

    console.log(`Total suggestions: ${suggestions.length}`);

    res.json({
      success: true,
      message: 'Debug suggestions thành công',
      data: {
        suggestions: suggestions,
        total: suggestions.length,
        debug: {
          farmerId,
          farmerEmail: farmer.email,
          businessesCount: businesses.length,
          verifiedBusinesses: businesses.filter(b => b.is_verified).length
        }
      }
    });

  } catch (error) {
    console.error('Debug suggestions error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Lỗi server khi debug suggestions', error: error.message });
  }
});

// Interface for partner matching criteria
interface PartnerMatchingCriteria {
  product_types?: string[];
  location_radius?: number; // in km
  min_esg_score?: number;
  certifications?: string[];
  quality_standards?: string[];
  max_distance?: number; // in km
}

// Interface for partner suggestion
interface PartnerSuggestion {
  user_id: number;
  business_name: string;
  email: string;
  phone?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
  esg_score?: number;
  esg_id?: string;
  certifications: string[];
  matching_score: number;
  matching_reasons: string[];
  distance_km?: number;
  preferred_product_types: string[];
  business_description?: string;
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate matching score between farmer and business
function calculateMatchingScore(
  farmer: any,
  farmerProfile: any,
  farmerProducts: any[],
  business: any,
  businessProfile: any,
  businessESG: any,
  criteria: PartnerMatchingCriteria
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const maxScore = 100;

  // 1. Product type matching (30 points)
  if (farmerProducts.length > 0 && criteria.product_types) {
    const farmerProductTypes = farmerProducts.map(p => p.product_type.toLowerCase());
    const matchingProductTypes = criteria.product_types.filter(type => 
      farmerProductTypes.some(farmerType => 
        farmerType.includes(type.toLowerCase()) || type.toLowerCase().includes(farmerType)
      )
    );
    
    if (matchingProductTypes.length > 0) {
      const productScore = (matchingProductTypes.length / criteria.product_types.length) * 30;
      score += productScore;
      reasons.push(`Sản phẩm phù hợp: ${matchingProductTypes.join(', ')}`);
    }
  }

  // 2. ESG Score matching (25 points)
  if (businessESG && businessESG.esg_score) {
    const esgScore = businessESG.esg_score;
    if (esgScore >= (criteria.min_esg_score || 70)) {
      const esgPoints = Math.min(25, (esgScore / 100) * 25);
      score += esgPoints;
      reasons.push(`ESG Score cao: ${esgScore}/100`);
    }
  }

  // 3. Certification matching (20 points)
  if (criteria.certifications && criteria.certifications.length > 0) {
    const businessCerts = businessProfile?.certifications || [];
    const matchingCerts = criteria.certifications.filter(cert => 
      businessCerts.some((businessCert: any) => 
        businessCert.name?.toLowerCase().includes(cert.toLowerCase()) ||
        cert.toLowerCase().includes(businessCert.name?.toLowerCase())
      )
    );
    
    if (matchingCerts.length > 0) {
      const certScore = (matchingCerts.length / criteria.certifications.length) * 20;
      score += certScore;
      reasons.push(`Chứng nhận phù hợp: ${matchingCerts.join(', ')}`);
    }
  }

  // 4. Location proximity (15 points)
  if (farmerProfile?.location_lat && farmerProfile?.location_lng && 
      businessProfile?.location_lat && businessProfile?.location_lng) {
    const distance = calculateDistance(
      farmerProfile.location_lat,
      farmerProfile.location_lng,
      businessProfile.location_lat,
      businessProfile.location_lng
    );
    
    if (distance <= (criteria.max_distance || 50)) {
      const distanceScore = Math.max(0, 15 - (distance / 10)); // Closer = higher score
      score += distanceScore;
      reasons.push(`Khoảng cách gần: ${distance.toFixed(1)}km`);
    }
  }

  // 5. Quality standards matching (10 points)
  if (criteria.quality_standards && criteria.quality_standards.length > 0) {
    const farmerStandards = farmerProducts.flatMap(p => p.quality_standards || []);
    const matchingStandards = criteria.quality_standards.filter(standard => 
      farmerStandards.some(farmerStandard => 
        farmerStandard.toLowerCase().includes(standard.toLowerCase()) ||
        standard.toLowerCase().includes(farmerStandard.toLowerCase())
      )
    );
    
    if (matchingStandards.length > 0) {
      const standardScore = (matchingStandards.length / criteria.quality_standards.length) * 10;
      score += standardScore;
      reasons.push(`Tiêu chuẩn chất lượng: ${matchingStandards.join(', ')}`);
    }
  }

  return { score: Math.min(maxScore, score), reasons };
}

// Get partner suggestions for farmers (NEW SIMPLE VERSION)
router.get('/suggestions', authenticateToken, requireRole(['farmer']), async (req: Request, res: Response) => {
  try {
    console.log('Partner suggestions request received');
    console.log('Query params:', req.query);
    const authReq = req as AuthenticatedRequest;
    const farmerId = authReq.user.id;
    
    console.log('Step 1: Getting farmer data...');
    const farmer = await UserModel.findById(farmerId);
    if (!farmer) {
      console.log('Farmer not found');
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin nông dân' });
    }
    console.log('Farmer found:', farmer.email);

    console.log('Step 2: Getting business users...');
    const businesses = await UserModel.getByRole('business', 100, 0);
    console.log('Business users count:', businesses.length);

    console.log('Step 3: Processing businesses...');
    const suggestions = [];
    
    for (const business of businesses) {
      console.log(`Processing business: ${business.full_name}`);
      
      // Skip if business is not verified
      if (!business.is_verified) {
        console.log(`Business ${business.full_name} not verified, skipping`);
        continue;
      }

      console.log(`Getting profile for business ${business.id}...`);
      const businessProfile = await UserProfileModel.findByUserId(business.id);
      console.log(`Profile found: ${businessProfile ? 'yes' : 'no'}`);

      console.log(`Getting ESG for business ${business.id}...`);
      const businessESG = await ESGVerificationModel.findByUserId(business.id);
      console.log(`ESG found: ${businessESG ? 'yes' : 'no'}, status: ${businessESG?.verification_status}`);

      // Skip if business doesn't have ESG verification or it's not approved
      if (!businessESG || businessESG.verification_status !== 'approved') {
        console.log(`Business ${business.full_name} ESG not approved, skipping`);
        continue;
      }

      console.log(`Adding business ${business.full_name} to suggestions`);
      suggestions.push({
        user_id: business.id,
        business_name: business.full_name,
        email: business.email,
        phone: business.phone,
        location_address: businessProfile?.address,
        location_lat: businessProfile?.location_lat,
        location_lng: businessProfile?.location_lng,
        esg_score: businessESG.esg_score,
        esg_id: businessESG.esg_id,
        certifications: businessProfile?.certifications?.map((c: any) => c.name) || [],
        matching_score: 70,
        matching_reasons: ['ESG đã được xác thực'],
        distance_km: undefined,
        preferred_product_types: ['Lúa'],
        business_description: businessProfile?.bio
      });
    }

    console.log(`Total suggestions: ${suggestions.length}`);

    res.json({
      success: true,
      message: 'Gợi ý đối tác thành công',
      data: {
        suggestions: suggestions,
        total: suggestions.length
      }
    });

  } catch (error) {
    console.error('Get partner suggestions error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi lấy gợi ý đối tác', 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Get business suggestions for farmers (reverse matching)
router.get('/business-suggestions', authenticateToken, requireRole(['business']), async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const businessId = authReq.user.id;
    
    // Get query parameters for matching criteria
    const {
      product_types,
      location_radius = 50,
      min_esg_score = 70,
      certifications,
      quality_standards,
      max_distance = 50
    } = req.query;

    const criteria: PartnerMatchingCriteria = {
      product_types: product_types ? (Array.isArray(product_types) ? product_types as string[] : [product_types as string]) : undefined,
      location_radius: Number(location_radius),
      min_esg_score: Number(min_esg_score),
      certifications: certifications ? (Array.isArray(certifications) ? certifications as string[] : [certifications as string]) : undefined,
      quality_standards: quality_standards ? (Array.isArray(quality_standards) ? quality_standards as string[] : [quality_standards as string]) : undefined,
      max_distance: Number(max_distance)
    };

    // Get business data
    const business = await UserModel.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin doanh nghiệp' });
    }

    const businessProfile = await UserProfileModel.findByUserId(businessId);
    const businessESG = await ESGVerificationModel.findByUserId(businessId);

    // Get all farmer users
    const farmers = await UserModel.getByRole('farmer', 100, 0);
    
    const suggestions: PartnerSuggestion[] = [];

    for (const farmer of farmers) {
      // Skip if farmer is not verified
      if (!farmer.is_verified) continue;

      const farmerProfile = await UserProfileModel.findByUserId(farmer.id);
      const farmerProducts = await db.findProductsByUserId(farmer.id);

      // Skip if farmer doesn't have products
      if (!farmerProducts || farmerProducts.length === 0) continue;

      // Calculate matching score
      const { score, reasons } = calculateMatchingScore(
        farmer,
        farmerProfile,
        farmerProducts,
        business,
        businessProfile,
        businessESG,
        criteria
      );

      // Only include suggestions with score > 30
      if (score > 30) {
        suggestions.push({
          user_id: farmer.id,
          business_name: farmer.full_name,
          email: farmer.email,
          phone: farmer.phone,
          location_address: farmerProfile?.address,
          location_lat: farmerProfile?.location_lat,
          location_lng: farmerProfile?.location_lng,
          esg_score: businessESG?.esg_score,
          esg_id: businessESG?.esg_id,
          certifications: farmerProfile?.certifications?.map((c: any) => c.name) || [],
          matching_score: Math.round(score),
          matching_reasons: reasons,
          distance_km: businessProfile?.location_lat && businessProfile?.location_lng && 
                      farmerProfile?.location_lat && farmerProfile?.location_lng ?
                      calculateDistance(
                        businessProfile.location_lat,
                        businessProfile.location_lng,
                        farmerProfile.location_lat,
                        farmerProfile.location_lng
                      ) : undefined,
          preferred_product_types: criteria.product_types || [],
          business_description: farmerProfile?.bio
        });
      }
    }

    // Sort by matching score (highest first)
    suggestions.sort((a, b) => b.matching_score - a.matching_score);

    // Limit to top 10 suggestions
    const topSuggestions = suggestions.slice(0, 10);

    res.json({
      success: true,
      message: 'Gợi ý nông dân thành công',
      data: {
        suggestions: topSuggestions,
        total: topSuggestions.length,
        criteria: criteria
      }
    });

  } catch (error) {
    console.error('Get business suggestions error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy gợi ý nông dân' });
  }
});

// Get available products for matching
router.get('/products', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { limit = 20, offset = 0, product_type, location_radius, user_lat, user_lng } = req.query;

    // Get available products - simplified for now
    const products = db.products.filter(product => product.status === 'available');

    let filteredProducts = products;

    // Filter by product type if specified
    if (product_type) {
      filteredProducts = filteredProducts.filter(product => 
        product.product_type.toLowerCase().includes((product_type as string).toLowerCase())
      );
    }

    // Filter by location if specified
    if (location_radius && user_lat && user_lng) {
      const radius = Number(location_radius);
      const userLat = Number(user_lat);
      const userLng = Number(user_lng);

      filteredProducts = filteredProducts.filter(product => {
        if (!product.location_lat || !product.location_lng) return false;
        
        const distance = calculateDistance(
          userLat,
          userLng,
          product.location_lat,
          product.location_lng
        );
        
        return distance <= radius;
      });
    }

    // Add distance information
    const productsWithDistance = filteredProducts.map(product => ({
      ...product,
      distance_km: product.location_lat && product.location_lng && user_lat && user_lng ?
        calculateDistance(
          Number(user_lat),
          Number(user_lng),
          product.location_lat,
          product.location_lng
        ) : undefined
    }));

    res.json({
      success: true,
      message: 'Lấy danh sách sản phẩm thành công',
      data: {
        products: productsWithDistance,
        total: productsWithDistance.length,
        limit: Number(limit),
        offset: Number(offset)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh sách sản phẩm' });
  }
});

export default router;
