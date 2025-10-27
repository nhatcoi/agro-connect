import { Router, Request, Response } from 'express';
import { ProductModel, CreateProductData, UpdateProductData } from '../models/Product';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// UC-12: Tạo sản phẩm nông sản
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const {
      season_id,
      product_name,
      product_type,
      quantity,
      unit,
      price_per_unit,
      currency,
      harvest_date,
      expiry_date,
      location_address,
      location_lat,
      location_lng,
      quality_standards,
      certifications,
      description,
      images
    } = req.body;

    // Validate required fields
    if (!product_name || !product_type || !quantity || !unit || !price_per_unit || !currency || !harvest_date || !location_address) {
      return res.status(400).json({
        success: false,
        message: 'Tên sản phẩm, loại sản phẩm, số lượng, đơn vị, giá, tiền tệ, ngày thu hoạch và địa chỉ là bắt buộc'
      });
    }

    // Validate numeric fields
    if (quantity <= 0 || price_per_unit <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng và giá phải lớn hơn 0'
      });
    }

    // Validate currency
    const validCurrencies = ['VND', 'USD', 'EUR'];
    if (!validCurrencies.includes(currency)) {
      return res.status(400).json({
        success: false,
        message: 'Tiền tệ không hợp lệ'
      });
    }

    // Validate dates
    const harvestDate = new Date(harvest_date);
    if (isNaN(harvestDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Ngày thu hoạch không hợp lệ'
      });
    }

    if (expiry_date) {
      const expiryDate = new Date(expiry_date);
      if (isNaN(expiryDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Ngày hết hạn không hợp lệ'
        });
      }
    }

    const productData: CreateProductData = {
      user_id: authReq.user.id,
      season_id,
      product_name,
      product_type,
      quantity,
      unit,
      price_per_unit,
      currency,
      harvest_date,
      expiry_date,
      location_address,
      location_lat,
      location_lng,
      quality_standards: quality_standards || [],
      certifications: certifications || [],
      description,
      images: images || []
    };

    const product = await ProductModel.create(productData);

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: product
    });

  } catch (error: any) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo sản phẩm'
    });
  }
});

// Lấy danh sách sản phẩm của user hiện tại
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { season_id, status, limit = 20, offset = 0 } = req.query;

    let products = await ProductModel.findByUserId(authReq.user.id);

    // Filter by season_id if provided
    if (season_id) {
      products = products.filter(product => product.season_id === Number(season_id));
    }

    // Filter by status if provided
    if (status) {
      products = products.filter(product => product.status === status);
    }

    // Apply pagination
    const paginatedProducts = products.slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        total: products.length,
        limit: Number(limit),
        offset: Number(offset)
      }
    });

  } catch (error: any) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách sản phẩm'
    });
  }
});

// Lấy danh sách sản phẩm có sẵn (public)
router.get('/available', async (req: Request, res: Response) => {
  try {
    const { product_type, location, min_price, max_price, limit = 20, offset = 0 } = req.query;

    let products = await ProductModel.findAvailable();

    // Filter by product_type if provided
    if (product_type) {
      products = products.filter(product => 
        product.product_type.toLowerCase().includes((product_type as string).toLowerCase())
      );
    }

    // Filter by location if provided
    if (location) {
      products = products.filter(product => 
        product.location_address.toLowerCase().includes((location as string).toLowerCase())
      );
    }

    // Filter by price range if provided
    if (min_price) {
      products = products.filter(product => product.price_per_unit >= Number(min_price));
    }
    if (max_price) {
      products = products.filter(product => product.price_per_unit <= Number(max_price));
    }

    // Apply pagination
    const paginatedProducts = products.slice(Number(offset), Number(offset) + Number(limit));

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        total: products.length,
        limit: Number(limit),
        offset: Number(offset)
      }
    });

  } catch (error: any) {
    console.error('Get available products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách sản phẩm có sẵn'
    });
  }
});

// Lấy sản phẩm theo season
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

    const products = await ProductModel.findBySeasonId(seasonId);

    // Filter by user ownership
    const userProducts = products.filter(product => product.user_id === authReq.user.id);

    res.json({
      success: true,
      data: userProducts
    });

  } catch (error: any) {
    console.error('Get season products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy sản phẩm mùa vụ'
    });
  }
});

// Lấy thông tin chi tiết sản phẩm
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'ID sản phẩm không hợp lệ'
      });
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error: any) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin sản phẩm'
    });
  }
});

// Cập nhật sản phẩm
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const authReq = req as AuthenticatedRequest;
    const updateData: UpdateProductData = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'ID sản phẩm không hợp lệ'
      });
    }

    // Check if product exists and user owns it
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    if (existingProduct.user_id !== authReq.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật sản phẩm này'
      });
    }

    // Validate numeric fields if provided
    if (updateData.quantity !== undefined && updateData.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng phải lớn hơn 0'
      });
    }

    if (updateData.price_per_unit !== undefined && updateData.price_per_unit <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá phải lớn hơn 0'
      });
    }

    // Validate currency if provided
    if (updateData.currency) {
      const validCurrencies = ['VND', 'USD', 'EUR'];
      if (!validCurrencies.includes(updateData.currency)) {
        return res.status(400).json({
          success: false,
          message: 'Tiền tệ không hợp lệ'
        });
      }
    }

    // Validate dates if provided
    if (updateData.harvest_date) {
      const harvestDate = new Date(updateData.harvest_date);
      if (isNaN(harvestDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Ngày thu hoạch không hợp lệ'
        });
      }
    }

    if (updateData.expiry_date) {
      const expiryDate = new Date(updateData.expiry_date);
      if (isNaN(expiryDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Ngày hết hạn không hợp lệ'
        });
      }
    }

    const updatedProduct = await ProductModel.update(productId, updateData);

    if (!updatedProduct) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật sản phẩm'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: updatedProduct
    });

  } catch (error: any) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật sản phẩm'
    });
  }
});

// Xóa sản phẩm
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const authReq = req as AuthenticatedRequest;

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: 'ID sản phẩm không hợp lệ'
      });
    }

    // Check if product exists and user owns it
    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    if (existingProduct.user_id !== authReq.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa sản phẩm này'
      });
    }

    const deleted = await ProductModel.delete(productId);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa sản phẩm'
      });
    }

    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });

  } catch (error: any) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa sản phẩm'
    });
  }
});

export default router;
