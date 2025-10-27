import { Router, Request, Response } from 'express';
import { ESGVerificationModel, ESGScoreDetailsModel, CreateESGScoreData } from '../models/SimpleESGVerification';
import { UserModel } from '../models/SimpleUser';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';

const router = Router();

// UC-03: Lấy thông tin xác thực ESG của user hiện tại
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    
    const verification = await ESGVerificationModel.findByUserId(userId);
    
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Chưa có yêu cầu xác thực ESG'
      });
    }

    // Get score details if verification is approved
    let scoreDetails = null;
    if (verification.verification_status === 'approved') {
      scoreDetails = await ESGScoreDetailsModel.findByVerificationId(verification.id);
    }

    res.json({
      success: true,
      data: {
        verification,
        score_details: scoreDetails
      }
    });

  } catch (error) {
    console.error('Get ESG verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin ESG'
    });
  }
});

// UC-03: Tạo yêu cầu xác thực ESG
router.post('/request', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const { verification_notes } = req.body;

    // Check if user already has a verification request
    const existingVerification = await ESGVerificationModel.findByUserId(userId);
    if (existingVerification) {
      return res.status(409).json({
        success: false,
        message: 'Đã có yêu cầu xác thực ESG'
      });
    }

    const verification = await ESGVerificationModel.create({
      user_id: userId,
      verification_notes
    });

    res.status(201).json({
      success: true,
      message: 'Yêu cầu xác thực ESG đã được tạo',
      data: verification
    });

  } catch (error) {
    console.error('Create ESG verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo yêu cầu xác thực'
    });
  }
});

// Lấy danh sách yêu cầu xác thực ESG (chỉ ESG Expert)
router.get('/pending', authenticateToken, requireRole(['esg_expert']), async (req: Request, res: Response) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const verifications = await ESGVerificationModel.getPending(
      Number(limit), 
      Number(offset)
    );

    // Get user info for each verification
    const verificationsWithUsers = await Promise.all(
      verifications.map(async (verification) => {
        const user = await UserModel.findById(verification.user_id);
        return {
          ...verification,
          user: user ? {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
          } : null
        };
      })
    );

    res.json({
      success: true,
      data: verificationsWithUsers
    });

  } catch (error) {
    console.error('Get pending ESG verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách yêu cầu xác thực'
    });
  }
});

// Duyệt yêu cầu xác thực ESG (chỉ ESG Expert)
router.post('/:verificationId/approve', authenticateToken, requireRole(['esg_expert']), async (req: Request, res: Response) => {
  try {
    const verificationId = Number(req.params.verificationId);
    const verifiedBy = (req as AuthenticatedRequest).user.id;
    const { esg_score, verification_notes, score_details } = req.body;

    if (isNaN(verificationId)) {
      return res.status(400).json({
        success: false,
        message: 'ID xác thực không hợp lệ'
      });
    }

    if (!esg_score || esg_score < 0 || esg_score > 100) {
      return res.status(400).json({
        success: false,
        message: 'ESG score phải từ 0-100'
      });
    }

    // Generate ESG ID
    const esgId = ESGVerificationModel.generateESGId();

    // Approve verification
    const verification = await ESGVerificationModel.approve(
      verificationId,
      verifiedBy,
      esgId,
      esg_score,
      verification_notes
    );

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu xác thực'
      });
    }

    // Create score details if provided
    let scoreDetails = null;
    if (score_details) {
      const scoreData: CreateESGScoreData = {
        esg_verification_id: verification.id,
        ...score_details
      };
      scoreDetails = await ESGScoreDetailsModel.create(scoreData);
    }

    res.json({
      success: true,
      message: 'Duyệt yêu cầu xác thực thành công',
      data: {
        verification,
        score_details: scoreDetails
      }
    });

  } catch (error) {
    console.error('Approve ESG verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi duyệt yêu cầu xác thực'
    });
  }
});

// Từ chối yêu cầu xác thực ESG (chỉ ESG Expert)
router.post('/:verificationId/reject', authenticateToken, requireRole(['esg_expert']), async (req: Request, res: Response) => {
  try {
    const verificationId = Number(req.params.verificationId);
    const verifiedBy = (req as AuthenticatedRequest).user.id;
    const { verification_notes } = req.body;

    if (isNaN(verificationId)) {
      return res.status(400).json({
        success: false,
        message: 'ID xác thực không hợp lệ'
      });
    }

    const verification = await ESGVerificationModel.reject(
      verificationId,
      verifiedBy,
      verification_notes
    );

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu xác thực'
      });
    }

    res.json({
      success: true,
      message: 'Từ chối yêu cầu xác thực thành công',
      data: verification
    });

  } catch (error) {
    console.error('Reject ESG verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi từ chối yêu cầu xác thực'
    });
  }
});

// Lấy thông tin xác thực ESG theo ESG ID (public)
router.get('/esg-id/:esgId', async (req: Request, res: Response) => {
  try {
    const { esgId } = req.params;
    
    const verification = await ESGVerificationModel.findByESGId(esgId);
    
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ESG ID'
      });
    }

    // Only show approved verifications publicly
    if (verification.verification_status !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'ESG ID chưa được xác thực'
      });
    }

    // Get user info
    const user = await UserModel.findById(verification.user_id);
    
    // Get score details
    const scoreDetails = await ESGScoreDetailsModel.findByVerificationId(verification.id);

    res.json({
      success: true,
      data: {
        verification,
        user: user ? {
          id: user.id,
          full_name: user.full_name,
          role: user.role
        } : null,
        score_details: scoreDetails
      }
    });

  } catch (error) {
    console.error('Get ESG by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin ESG'
    });
  }
});

// Auto-approve Super ESG Expert (for system initialization)
router.post('/auto-approve-super-expert', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    if (user.role !== 'esg_expert') {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể auto-approve ESG Expert'
      });
    }

    // Find ESG verification
    const verification = await ESGVerificationModel.findByUserId(user.id);
    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ESG verification request'
      });
    }

    if (verification.verification_status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'ESG verification đã được xử lý'
      });
    }

    // Auto-approve
    const approvedVerification = await ESGVerificationModel.approve(
      verification.id,
      user.id, // Self-verified for super expert
      ESGVerificationModel.generateESGId(),
      100, // Perfect score for super expert
      'Auto-approved Super ESG Expert - System initialization'
    );

    res.json({
      success: true,
      message: 'Super ESG Expert đã được auto-approve',
      data: approvedVerification
    });

  } catch (error) {
    console.error('Auto-approve super expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi auto-approve'
    });
  }
});

export default router;
