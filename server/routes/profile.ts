import { Router, Request, Response } from 'express';
import { UserProfileModel, UpdateUserProfileData } from '../models/SimpleUserProfile';
import { UserModel } from '../models/SimpleUser';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// UC-02: Lấy hồ sơ người dùng
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    
    const user = await UserModel.findById(userId);
    const profile = await UserProfileModel.findByUserId(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Remove password from user data
    const { password_hash, ...userData } = user;
    
    // Parse JSON fields in profile
    const profileData = profile ? UserProfileModel.parseProfile(profile) : null;

    res.json({
      success: true,
      data: {
        user: userData,
        profile: profileData
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy hồ sơ'
    });
  }
});

// UC-02: Cập nhật hồ sơ người dùng
router.put('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const {
      bio,
      location_lat,
      location_lng,
      address,
      certifications,
      activity_history,
      social_links
    } = req.body;

    const updateData: UpdateUserProfileData = {
      bio,
      location_lat: location_lat ? parseFloat(location_lat) : undefined,
      location_lng: location_lng ? parseFloat(location_lng) : undefined,
      address,
      certifications,
      activity_history,
      social_links
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof UpdateUserProfileData] === undefined) {
        delete updateData[key as keyof UpdateUserProfileData];
      }
    });

    const profile = await UserProfileModel.update(userId, updateData);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ'
      });
    }

    const parsedProfile = UserProfileModel.parseProfile(profile);

    res.json({
      success: true,
      message: 'Cập nhật hồ sơ thành công',
      data: parsedProfile
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật hồ sơ'
    });
  }
});

// Lấy hồ sơ user khác (public)
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'ID user không hợp lệ'
      });
    }

    const user = await UserModel.findById(userId);
    const profile = await UserProfileModel.findByUserId(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Remove sensitive data
    const { password_hash, email, phone, ...userData } = user;
    
    // Parse JSON fields in profile
    const profileData = profile ? UserProfileModel.parseProfile(profile) : null;

    res.json({
      success: true,
      data: {
        user: userData,
        profile: profileData
      }
    });

  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy hồ sơ'
    });
  }
});

// Lấy danh sách users theo role
router.get('/role/:role', async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const validRoles = ['farmer', 'business', 'consumer', 'esg_expert'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role không hợp lệ'
      });
    }

    const users = await UserModel.getByRole(role, Number(limit), Number(offset));
    
    // Remove sensitive data
    const publicUsers = users.map(user => {
      const { password_hash, email, phone, ...userData } = user;
      return userData;
    });

    res.json({
      success: true,
      data: publicUsers
    });

  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách users'
    });
  }
});

// Cập nhật hồ sơ user hiện tại
router.put('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { bio, address, certifications, social_links } = req.body;

    // Update profile
    const updatedProfile = await UserProfileModel.update(authReq.user.id, {
      bio,
      address,
      certifications: certifications || [],
      social_links: social_links || {}
    });

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ user'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật hồ sơ thành công',
      data: updatedProfile
    });

  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật hồ sơ'
    });
  }
});

export default router;
