import { Router, Request, Response } from 'express';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { ProductModel } from '../models/Product';
import { OrderModel } from '../models/Order';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
// import blockchainService from '../services/blockchain';
import { formatProductForBlockchain } from '../config/blockchain';

const router = Router();

// UC-30: Sinh mã QR sản phẩm
router.post('/generate', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { product_id, order_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID là bắt buộc'
      });
    }

    // Lấy thông tin sản phẩm
    const product = await ProductModel.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Kiểm tra quyền sở hữu sản phẩm
    if (product.user_id !== authReq.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền tạo QR code cho sản phẩm này'
      });
    }

    // Tạo blockchain hash
    const blockchainData = {
      product_id: product.id,
      product_name: product.product_name,
      farmer_id: product.user_id,
      harvest_date: product.harvest_date,
      location: product.location_address,
      quality_standards: product.quality_standards,
      certifications: product.certifications,
      created_at: new Date().toISOString(),
      order_id: order_id || null
    };

    // Tạo hash cho blockchain
    const blockchainHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(blockchainData))
      .digest('hex');

    // Kiểm tra blockchain availability
    // const isBlockchainAvailable = await blockchainService.isAvailable();
    const isBlockchainAvailable = false;
    let blockchainTxHash = null;

    if (isBlockchainAvailable) {
      try {
        // Lấy thông tin farmer
        const { UserModel } = await import('../models/SimpleUser');
        const farmer = await UserModel.findById(product.user_id);
        
        // Format product data for blockchain
        const blockchainProductData = formatProductForBlockchain({
          ...product,
          farmer_name: farmer?.full_name || 'Unknown',
          farmer_email: farmer?.email || ''
        });

        // Thêm sản phẩm lên blockchain
        // const blockchainResult = await blockchainService.addProduct(blockchainProductData);
        const blockchainResult = { success: false, error: 'Blockchain disabled' };
        
        if (blockchainResult.success) {
          blockchainTxHash = blockchainResult.txHash;
          console.log('✅ Product added to blockchain:', blockchainTxHash);
          
          // Verify product on blockchain
          // const verifyResult = await blockchainService.verifyProduct(product.id, blockchainHash);
          const verifyResult = { success: false, error: 'Blockchain disabled' };
          if (verifyResult.success) {
            console.log('✅ Product verified on blockchain:', verifyResult.txHash);
          }
        } else {
          console.warn('⚠️  Failed to add product to blockchain:', blockchainResult.error);
        }
      } catch (error) {
        console.error('❌ Blockchain error:', error);
      }
    } else {
      console.warn('⚠️  Blockchain not available, using local hash only');
    }

    // Tạo QR data
    const qrData = {
      type: 'product_traceability',
      product_id: product.id,
      blockchain_hash: blockchainHash,
      blockchain_tx_hash: blockchainTxHash,
      traceability_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/traceability/${product.id}`,
      created_at: new Date().toISOString()
    };

    // Tạo QR code
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#2E7D32', // Agro green
        light: '#FFFFFF'
      }
    });

    // Cập nhật sản phẩm với blockchain hash
    await ProductModel.update(product.id, {
      blockchain_hash: blockchainHash
    });

    res.json({
      success: true,
      message: 'Tạo QR code thành công',
      data: {
        qr_code: qrCodeDataURL,
        blockchain_hash: blockchainHash,
        blockchain_tx_hash: blockchainTxHash,
        blockchain_available: isBlockchainAvailable,
        traceability_url: qrData.traceability_url,
        product_info: {
          id: product.id,
          name: product.product_name,
          harvest_date: product.harvest_date,
          location: product.location_address
        }
      }
    });

  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo QR code'
    });
  }
});

// Lấy thông tin truy xuất từ QR code
router.get('/traceability/:productId', async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);
    
    // Kiểm tra blockchain availability
    // const isBlockchainAvailable = await blockchainService.isAvailable();
    const isBlockchainAvailable = false;
    let blockchainProduct = null;
    let blockchainVerification = null;

    // Nếu blockchain available, lấy dữ liệu từ blockchain
    if (isBlockchainAvailable) {
      try {
        // const productResult = await blockchainService.getProduct(productId);
        const productResult = { success: false, error: 'Blockchain disabled' };
        if (productResult.success) {
          blockchainProduct = productResult.product;
        }

        // const verificationResult = await blockchainService.getVerification(productId);
        const verificationResult = { success: false, error: 'Blockchain disabled' };
        if (verificationResult.success) {
          blockchainVerification = verificationResult.verification;
        }
      } catch (error) {
        console.warn('⚠️  Error reading from blockchain:', error);
      }
    }
    
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Lấy thông tin farmer
    const { UserModel } = await import('../models/SimpleUser');
    const farmer = await UserModel.findById(product.user_id);

    // Lấy thông tin orders liên quan
    const orders = await OrderModel.findByFarmerId(product.user_id);
    const productOrders = orders.filter(order => order.product_id === product.id);

    // Tạo blockchain verification
    const blockchainData = {
      product_id: product.id,
      product_name: product.product_name,
      farmer_id: product.user_id,
      harvest_date: product.harvest_date,
      location: product.location_address,
      quality_standards: product.quality_standards,
      certifications: product.certifications,
      created_at: product.created_at
    };

    const expectedHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(blockchainData))
      .digest('hex');

    const isVerified = product.blockchain_hash === expectedHash;

    res.json({
      success: true,
      data: {
        product: {
          id: product.id,
          name: product.product_name,
          type: product.product_type,
          quantity: product.quantity,
          unit: product.unit,
          harvest_date: product.harvest_date,
          location: product.location_address,
          quality_standards: product.quality_standards,
          certifications: product.certifications,
          blockchain_hash: product.blockchain_hash,
          created_at: product.created_at
        },
        farmer: farmer ? {
          id: farmer.id,
          name: farmer.full_name,
          email: farmer.email
        } : null,
        orders: productOrders.map(order => ({
          id: order.id,
          order_number: order.order_number,
          business_id: order.business_id,
          quantity: order.quantity,
          status: order.status,
          created_at: order.created_at
        })),
        blockchain_verification: {
          is_verified,
          expected_hash: expectedHash,
          actual_hash: product.blockchain_hash,
          verification_date: new Date().toISOString(),
          blockchain_available: isBlockchainAvailable,
          blockchain_product: blockchainProduct,
          blockchain_verification: blockchainVerification
        }
      }
    });

  } catch (error) {
    console.error('Get traceability error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin truy xuất'
    });
  }
});

// Quét QR code và lấy thông tin
router.post('/scan', async (req: Request, res: Response) => {
  try {
    const { qr_data } = req.body;

    if (!qr_data) {
      return res.status(400).json({
        success: false,
        message: 'QR data là bắt buộc'
      });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(qr_data);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'QR code không hợp lệ'
      });
    }

    if (parsedData.type !== 'product_traceability') {
      return res.status(400).json({
        success: false,
        message: 'QR code không phải là mã truy xuất sản phẩm'
      });
    }

    // Lấy thông tin sản phẩm
    const product = await ProductModel.findById(parsedData.product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Verify blockchain hash
    const blockchainData = {
      product_id: product.id,
      product_name: product.product_name,
      farmer_id: product.user_id,
      harvest_date: product.harvest_date,
      location: product.location_address,
      quality_standards: product.quality_standards,
      certifications: product.certifications,
      created_at: product.created_at
    };

    const expectedHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(blockchainData))
      .digest('hex');

    const isVerified = parsedData.blockchain_hash === expectedHash;

    res.json({
      success: true,
      data: {
        product_id: product.id,
        product_name: product.product_name,
        blockchain_verified: isVerified,
        traceability_url: parsedData.traceability_url,
        created_at: parsedData.created_at
      }
    });

  } catch (error) {
    console.error('Scan QR code error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi quét QR code'
    });
  }
});

// Kiểm tra trạng thái blockchain
router.get('/blockchain/status', async (req: Request, res: Response) => {
  try {
    // const isAvailable = await blockchainService.isAvailable();
    const isAvailable = false;
    
    if (isAvailable) {
      // const stats = await blockchainService.getStats();
      const stats = { error: 'Blockchain disabled' };
      res.json({
        success: true,
        data: {
          available: true,
          ...stats.data
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          available: false,
          message: 'Blockchain không khả dụng'
        }
      });
    }
  } catch (error) {
    console.error('Blockchain status error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra trạng thái blockchain'
    });
  }
});

export default router;
