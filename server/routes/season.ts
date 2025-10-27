import { Router, Request, Response } from 'express';
import { SeasonModel, CreateSeasonData, UpdateSeasonData } from '../models/Season';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// UC-10: Tạo mùa vụ mới
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const {
      season_name,
      crop_type,
      planting_date,
      expected_harvest_date,
      area_size,
      location_lat,
      location_lng,
      location_address,
      fertilizers,
      pesticides,
      notes
    } = req.body;

    // Validate required fields
    if (!season_name || !crop_type || !planting_date || !expected_harvest_date || !area_size) {
      return res.status(400).json({
        success: false,
        message: 'Tên mùa vụ, loại cây trồng, ngày gieo trồng, ngày thu hoạch dự kiến và diện tích là bắt buộc'
      });
    }

    // Validate dates
    const plantingDate = new Date(planting_date);
    const harvestDate = new Date(expected_harvest_date);
    
    if (plantingDate >= harvestDate) {
      return res.status(400).json({
        success: false,
        message: 'Ngày thu hoạch dự kiến phải sau ngày gieo trồng'
      });
    }

    // Validate area size
    if (area_size <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Diện tích phải lớn hơn 0'
      });
    }

    const seasonData: CreateSeasonData = {
      user_id: authReq.user.id,
      season_name,
      crop_type,
      planting_date,
      expected_harvest_date,
      area_size,
      location_lat,
      location_lng,
      location_address,
      fertilizers: fertilizers || [],
      pesticides: pesticides || [],
      notes
    };

    const season = await SeasonModel.create(seasonData);

    res.status(201).json({
      success: true,
      message: 'Tạo mùa vụ thành công',
      data: season
    });

  } catch (error: any) {
    console.error('Create season error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo mùa vụ'
    });
  }
});

// Lấy danh sách mùa vụ của user hiện tại
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { status, limit = 20, offset = 0 } = req.query;

    let seasons = await SeasonModel.findByUserId(authReq.user.id);

    // Filter by status if provided
    if (status) {
      seasons = seasons.filter(season => season.status === status);
    }

    // Apply pagination
    const paginatedSeasons = seasons.slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      success: true,
      data: {
        seasons: paginatedSeasons,
        total: seasons.length,
        limit: Number(limit),
        offset: Number(offset)
      }
    });

  } catch (error: any) {
    console.error('Get seasons error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách mùa vụ'
    });
  }
});

// Lấy thông tin chi tiết mùa vụ
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const seasonId = Number(req.params.id);
    const authReq = req as AuthenticatedRequest;

    if (isNaN(seasonId)) {
      return res.status(400).json({
        success: false,
        message: 'ID mùa vụ không hợp lệ'
      });
    }

    const season = await SeasonModel.findById(seasonId);

    if (!season) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy mùa vụ'
      });
    }

    // Check if user owns this season
    if (season.user_id !== authReq.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập mùa vụ này'
      });
    }

    res.json({
      success: true,
      data: season
    });

  } catch (error: any) {
    console.error('Get season error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin mùa vụ'
    });
  }
});

// Cập nhật mùa vụ
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const seasonId = Number(req.params.id);
    const authReq = req as AuthenticatedRequest;
    const updateData: UpdateSeasonData = req.body;

    if (isNaN(seasonId)) {
      return res.status(400).json({
        success: false,
        message: 'ID mùa vụ không hợp lệ'
      });
    }

    // Check if season exists and user owns it
    const existingSeason = await SeasonModel.findById(seasonId);
    if (!existingSeason) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy mùa vụ'
      });
    }

    if (existingSeason.user_id !== authReq.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật mùa vụ này'
      });
    }

    // Validate dates if provided
    if (updateData.planting_date && updateData.expected_harvest_date) {
      const plantingDate = new Date(updateData.planting_date);
      const harvestDate = new Date(updateData.expected_harvest_date);
      
      if (plantingDate >= harvestDate) {
        return res.status(400).json({
          success: false,
          message: 'Ngày thu hoạch dự kiến phải sau ngày gieo trồng'
        });
      }
    }

    // Validate area size if provided
    if (updateData.area_size !== undefined && updateData.area_size <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Diện tích phải lớn hơn 0'
      });
    }

    const updatedSeason = await SeasonModel.update(seasonId, updateData);

    if (!updatedSeason) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật mùa vụ'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật mùa vụ thành công',
      data: updatedSeason
    });

  } catch (error: any) {
    console.error('Update season error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật mùa vụ'
    });
  }
});

// Xóa mùa vụ
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const seasonId = Number(req.params.id);
    const authReq = req as AuthenticatedRequest;

    if (isNaN(seasonId)) {
      return res.status(400).json({
        success: false,
        message: 'ID mùa vụ không hợp lệ'
      });
    }

    // Check if season exists and user owns it
    const existingSeason = await SeasonModel.findById(seasonId);
    if (!existingSeason) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy mùa vụ'
      });
    }

    if (existingSeason.user_id !== authReq.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa mùa vụ này'
      });
    }

    const deleted = await SeasonModel.delete(seasonId);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa mùa vụ'
      });
    }

    res.json({
      success: true,
      message: 'Xóa mùa vụ thành công'
    });

  } catch (error: any) {
    console.error('Delete season error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa mùa vụ'
    });
  }
});

export default router;
