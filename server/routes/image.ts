import { Router, Request, Response } from 'express';
import { ImageModel, CreateImageData, UpdateImageData } from '../models/Image';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// UC-11: Tải lên hình ảnh thực địa
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const {
      season_id,
      image_url,
      image_type,
      title,
      description,
      tags,
      location_lat,
      location_lng,
      taken_date
    } = req.body;

    // Validate required fields
    if (!image_url || !image_type || !title || !taken_date) {
      return res.status(400).json({
        success: false,
        message: 'URL hình ảnh, loại hình ảnh, tiêu đề và ngày chụp là bắt buộc'
      });
    }

    // Validate image_type
    const validTypes = ['crop', 'field', 'certificate', 'diary', 'other'];
    if (!validTypes.includes(image_type)) {
      return res.status(400).json({
        success: false,
        message: 'Loại hình ảnh không hợp lệ'
      });
    }

    // Validate taken_date
    const takenDate = new Date(taken_date);
    if (isNaN(takenDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Ngày chụp không hợp lệ'
      });
    }

    const imageData: CreateImageData = {
      user_id: authReq.user.id,
      season_id,
      image_url,
      image_type,
      title,
      description,
      tags: tags || [],
      location_lat,
      location_lng,
      taken_date
    };

    const image = await ImageModel.create(imageData);

    res.status(201).json({
      success: true,
      message: 'Tải lên hình ảnh thành công',
      data: image
    });

  } catch (error: any) {
    console.error('Create image error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tải lên hình ảnh'
    });
  }
});

// Lấy danh sách hình ảnh của user hiện tại
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { season_id, image_type, limit = 20, offset = 0 } = req.query;

    let images = await ImageModel.findByUserId(authReq.user.id);

    // Filter by season_id if provided
    if (season_id) {
      images = images.filter(image => image.season_id === Number(season_id));
    }

    // Filter by image_type if provided
    if (image_type) {
      images = images.filter(image => image.image_type === image_type);
    }

    // Apply pagination
    const paginatedImages = images.slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      success: true,
      data: {
        images: paginatedImages,
        total: images.length,
        limit: Number(limit),
        offset: Number(offset)
      }
    });

  } catch (error: any) {
    console.error('Get images error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách hình ảnh'
    });
  }
});

// Lấy hình ảnh theo season
router.get('/season/:seasonId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const seasonId = Number(req.params.seasonId);
    const authReq = req as AuthenticatedRequest;

    if (isNaN(seasonId)) {
      return res.status(400).json({
        success: false,
        message: 'ID mùa vụ không hợp lệ'
      });
    }

    const images = await ImageModel.findBySeasonId(seasonId);

    // Filter by user ownership
    const userImages = images.filter(image => image.user_id === authReq.user.id);

    res.json({
      success: true,
      data: userImages
    });

  } catch (error: any) {
    console.error('Get season images error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy hình ảnh mùa vụ'
    });
  }
});

// Lấy thông tin chi tiết hình ảnh
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const imageId = Number(req.params.id);
    const authReq = req as AuthenticatedRequest;

    if (isNaN(imageId)) {
      return res.status(400).json({
        success: false,
        message: 'ID hình ảnh không hợp lệ'
      });
    }

    const image = await ImageModel.findById(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hình ảnh'
      });
    }

    // Check if user owns this image
    if (image.user_id !== authReq.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập hình ảnh này'
      });
    }

    res.json({
      success: true,
      data: image
    });

  } catch (error: any) {
    console.error('Get image error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin hình ảnh'
    });
  }
});

// Cập nhật hình ảnh
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const imageId = Number(req.params.id);
    const authReq = req as AuthenticatedRequest;
    const updateData: UpdateImageData = req.body;

    if (isNaN(imageId)) {
      return res.status(400).json({
        success: false,
        message: 'ID hình ảnh không hợp lệ'
      });
    }

    // Check if image exists and user owns it
    const existingImage = await ImageModel.findById(imageId);
    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hình ảnh'
      });
    }

    if (existingImage.user_id !== authReq.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật hình ảnh này'
      });
    }

    // Validate image_type if provided
    if (updateData.image_type) {
      const validTypes = ['crop', 'field', 'certificate', 'diary', 'other'];
      if (!validTypes.includes(updateData.image_type)) {
        return res.status(400).json({
          success: false,
          message: 'Loại hình ảnh không hợp lệ'
        });
      }
    }

    // Validate taken_date if provided
    if (updateData.taken_date) {
      const takenDate = new Date(updateData.taken_date);
      if (isNaN(takenDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Ngày chụp không hợp lệ'
        });
      }
    }

    const updatedImage = await ImageModel.update(imageId, updateData);

    if (!updatedImage) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật hình ảnh'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật hình ảnh thành công',
      data: updatedImage
    });

  } catch (error: any) {
    console.error('Update image error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật hình ảnh'
    });
  }
});

// Xóa hình ảnh
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const imageId = Number(req.params.id);
    const authReq = req as AuthenticatedRequest;

    if (isNaN(imageId)) {
      return res.status(400).json({
        success: false,
        message: 'ID hình ảnh không hợp lệ'
      });
    }

    // Check if image exists and user owns it
    const existingImage = await ImageModel.findById(imageId);
    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hình ảnh'
      });
    }

    if (existingImage.user_id !== authReq.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa hình ảnh này'
      });
    }

    const deleted = await ImageModel.delete(imageId);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa hình ảnh'
      });
    }

    res.json({
      success: true,
      message: 'Xóa hình ảnh thành công'
    });

  } catch (error: any) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa hình ảnh'
    });
  }
});

export default router;
