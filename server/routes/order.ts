import { Router, Request, Response } from 'express';
import { OrderModel, CreateOrderData, UpdateOrderData } from '../models/Order';
import { ProductModel } from '../models/Product';
import { UserModel } from '../models/SimpleUser';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';

const router = Router();

// Create a new order (Business only)
router.post('/', authenticateToken, requireRole(['business']), async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const {
      farmer_id,
      product_id,
      quantity,
      unit,
      price_per_unit,
      currency,
      delivery_address,
      delivery_lat,
      delivery_lng,
      delivery_date,
      notes
    } = req.body;

    // Basic validation
    if (!farmer_id || !product_id || !quantity || !unit || !price_per_unit || !currency || !delivery_address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Farmer ID, Product ID, quantity, unit, price, currency và địa chỉ giao hàng là bắt buộc.' 
      });
    }

    // Check if product exists and is available
    const product = await ProductModel.findById(product_id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy sản phẩm.' 
      });
    }

    if (product.status !== 'available') {
      return res.status(400).json({ 
        success: false, 
        message: 'Sản phẩm không có sẵn để đặt hàng.' 
      });
    }

    // Check if farmer exists
    const farmer = await UserModel.findById(farmer_id);
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy nông dân.' 
      });
    }

    // Calculate total amount
    const total_amount = quantity * price_per_unit;

    const orderData: CreateOrderData = {
      farmer_id: Number(farmer_id),
      business_id: authReq.user.id,
      product_id: Number(product_id),
      quantity: Number(quantity),
      unit,
      price_per_unit: Number(price_per_unit),
      total_amount,
      currency,
      delivery_address,
      delivery_lat: delivery_lat ? Number(delivery_lat) : undefined,
      delivery_lng: delivery_lng ? Number(delivery_lng) : undefined,
      delivery_date,
      notes,
      status: 'pending'
    };

    const newOrder = await OrderModel.create(orderData);

    // Update product status to reserved
    await ProductModel.update(product_id, { status: 'reserved' });

    res.status(201).json({ 
      success: true, 
      message: 'Tạo đơn hàng thành công', 
      data: newOrder 
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi tạo đơn hàng' 
    });
  }
});

// Get all orders for the authenticated user
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    console.log('Get orders request received');
    const authReq = req as AuthenticatedRequest;
    const { status, limit = 50, offset = 0 } = req.query;

    console.log('User ID:', authReq.user.id);
    console.log('Status filter:', status);

    let orders;
    if (status) {
      orders = await OrderModel.findByStatus(status as string);
      // Filter by user
      orders = orders.filter(order => 
        order.farmer_id === authReq.user.id || order.business_id === authReq.user.id
      );
    } else {
      orders = await OrderModel.findByUserId(authReq.user.id);
    }

    console.log('Orders found:', orders.length);

    // Apply pagination
    const paginatedOrders = orders.slice(Number(offset), Number(offset) + Number(limit));

    res.json({ 
      success: true, 
      data: { 
        orders: paginatedOrders, 
        total: orders.length, 
        limit: Number(limit), 
        offset: Number(offset) 
      } 
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi lấy danh sách đơn hàng' 
    });
  }
});

// Get order statistics for the authenticated user
router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const stats = await OrderModel.getOrderStats(authReq.user.id);

    res.json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi lấy thống kê đơn hàng' 
    });
  }
});

// Get a specific order by ID
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const orderId = Number(req.params.id);

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy đơn hàng.' 
      });
    }

    // Check if user has access to this order
    if (order.farmer_id !== authReq.user.id && order.business_id !== authReq.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Bạn không có quyền truy cập đơn hàng này.' 
      });
    }

    res.json({ 
      success: true, 
      data: order 
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi lấy thông tin đơn hàng' 
    });
  }
});

// Update an order
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const orderId = Number(req.params.id);
    const updateData: UpdateOrderData = req.body;

    const existingOrder = await OrderModel.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy đơn hàng.' 
      });
    }

    // Check if user has access to this order
    if (existingOrder.farmer_id !== authReq.user.id && existingOrder.business_id !== authReq.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Bạn không có quyền chỉnh sửa đơn hàng này.' 
      });
    }

    // Validate status transitions
    if (updateData.status) {
      const validTransitions: { [key: string]: string[] } = {
        'pending': ['negotiating', 'cancelled'],
        'negotiating': ['confirmed', 'cancelled'],
        'confirmed': ['in_progress', 'cancelled'],
        'in_progress': ['shipped', 'cancelled'],
        'shipped': ['delivered'],
        'delivered': ['completed'],
        'cancelled': [],
        'completed': []
      };

      const currentStatus = existingOrder.status;
      const newStatus = updateData.status;

      if (!validTransitions[currentStatus]?.includes(newStatus)) {
        return res.status(400).json({ 
          success: false, 
          message: `Không thể chuyển từ trạng thái ${currentStatus} sang ${newStatus}.` 
        });
      }
    }

    // Recalculate total amount if quantity or price changes
    if (updateData.quantity || updateData.price_per_unit) {
      const quantity = updateData.quantity || existingOrder.quantity;
      const price_per_unit = updateData.price_per_unit || existingOrder.price_per_unit;
      updateData.total_amount = quantity * price_per_unit;
    }

    const updatedOrder = await OrderModel.update(orderId, updateData);

    res.json({ 
      success: true, 
      message: 'Cập nhật đơn hàng thành công', 
      data: updatedOrder 
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi cập nhật đơn hàng' 
    });
  }
});

// Delete an order (only if status is pending or cancelled)
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const orderId = Number(req.params.id);

    const existingOrder = await OrderModel.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy đơn hàng.' 
      });
    }

    // Check if user has access to this order
    if (existingOrder.farmer_id !== authReq.user.id && existingOrder.business_id !== authReq.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Bạn không có quyền xóa đơn hàng này.' 
      });
    }

    // Only allow deletion if order is pending or cancelled
    if (!['pending', 'cancelled'].includes(existingOrder.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Chỉ có thể xóa đơn hàng ở trạng thái pending hoặc cancelled.' 
      });
    }

    const deleted = await OrderModel.delete(orderId);

    if (deleted) {
      // Update product status back to available
      await ProductModel.update(existingOrder.product_id, { status: 'available' });

      res.json({ 
        success: true, 
        message: 'Xóa đơn hàng thành công' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Không thể xóa đơn hàng' 
      });
    }
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server khi xóa đơn hàng' 
    });
  }
});

export default router;
