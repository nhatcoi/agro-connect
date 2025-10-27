import { Request, Response, NextFunction } from 'express';
import { SessionModel } from '../models/SimpleSession';
import { UserModel } from '../models/SimpleUser';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token xác thực không được cung cấp'
      });
    }

    const session = await SessionModel.findByToken(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    const user = await UserModel.findById(session.user_id);
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa'
      });
    }

    (req as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }
    
    next();
  };
};
