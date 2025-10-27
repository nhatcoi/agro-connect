import { Router } from 'express';
import { UserModel, CreateUserData } from '../models/SimpleUser';
import { UserProfileModel, CreateUserProfileData } from '../models/SimpleUserProfile';
import { ESGVerificationModel } from '../models/SimpleESGVerification';
import { SessionModel } from '../models/SimpleSession';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// UC-01: Đăng ký tài khoản
router.post('/register', async (req, res) => {
  try {
    const { email, phone, password, role, full_name, avatar_url } = req.body;

    // Validation
    if (!email || !password || !role || !full_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, role và full_name là bắt buộc'
      });
    }

    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await UserModel.findByPhone(phone);
      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: 'Số điện thoại đã được sử dụng'
        });
      }
    }

    // Validate role
    const validRoles = ['farmer', 'business', 'consumer', 'esg_expert'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role không hợp lệ'
      });
    }

    // Create user
    const userData: CreateUserData = {
      email,
      phone,
      password,
      role,
      full_name,
      avatar_url
    };

    const user = await UserModel.create(userData);

    // Create user profile
    const profileData: CreateUserProfileData = {
      user_id: user.id,
      bio: '',
      certifications: [],
      activity_history: [],
      social_links: {}
    };

    await UserProfileModel.create(profileData);

    // Create ESG verification request for farmers, businesses, and ESG experts
    if (role === 'farmer' || role === 'business' || role === 'esg_expert') {
      await ESGVerificationModel.create({
        user_id: user.id,
        verification_notes: 'Yêu cầu xác thực ESG tự động khi đăng ký'
      });
    }

    // Remove password from response
    const { password_hash, ...userResponse } = user;

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký'
    });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và password là bắt buộc'
      });
    }

    const user = await UserModel.verifyPassword(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa'
      });
    }

    // Create session
    const session = await SessionModel.create(user.id);

    // Remove password from response
    const { password_hash, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: userResponse,
        session_token: session.session_token,
        expires_at: session.expires_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập'
    });
  }
});

// Đăng xuất
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const sessionToken = req.headers.authorization?.replace('Bearer ', '');
    
    if (sessionToken) {
      await SessionModel.deleteByToken(sessionToken);
    }

    res.json({
      success: true,
      message: 'Đăng xuất thành công'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng xuất'
    });
  }
});

// Lấy thông tin user hiện tại
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Remove password from response
    const { password_hash, ...userResponse } = user;

    res.json({
      success: true,
      data: userResponse
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin user'
    });
  }
});

// Cập nhật thông tin user
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { email, phone, full_name, avatar_url } = req.body;

    // Check if email is being changed and already exists
    if (email) {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          success: false,
          message: 'Email đã được sử dụng'
        });
      }
    }

    // Check if phone is being changed and already exists
    if (phone) {
      const existingPhone = await UserModel.findByPhone(phone);
      if (existingPhone && existingPhone.id !== userId) {
        return res.status(409).json({
          success: false,
          message: 'Số điện thoại đã được sử dụng'
        });
      }
    }

    const updateData = {
      email,
      phone,
      full_name,
      avatar_url
    };

    const user = await UserModel.update(userId, updateData);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Remove password from response
    const { password_hash, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: userResponse
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thông tin'
    });
  }
});

// Cập nhật thông tin user hiện tại
router.put('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { full_name, email, phone } = req.body;

    // Validate input
    if (!full_name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Họ tên và email là bắt buộc'
      });
    }

    // Check if email is already taken by another user
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser && existingUser.id !== authReq.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng bởi tài khoản khác'
      });
    }

    // Update user
    const updatedUser = await UserModel.update(authReq.user.id, {
      full_name,
      email,
      phone
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: updatedUser
    });

  } catch (error: any) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thông tin'
    });
  }
});

export default router;
