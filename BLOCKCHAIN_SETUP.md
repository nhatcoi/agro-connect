# 🔗 Blockchain Integration Setup

## 📋 Tổng quan

Dự án AgroConnect đã được tích hợp với **Polygon Mumbai Testnet** để cung cấp tính năng truy xuất nguồn gốc sản phẩm thực sự trên blockchain.

## 🚀 Tính năng Blockchain

### ✅ **Đã triển khai:**
- **Smart Contract** cho Product Traceability
- **Blockchain Service** để tương tác với Polygon
- **QR Code Generation** với blockchain hash
- **Product Verification** trên blockchain
- **Traceability API** đọc từ blockchain
- **UI Components** hiển thị trạng thái blockchain

### 🔧 **Công nghệ sử dụng:**
- **Ethereum/Polygon** blockchain
- **Solidity** smart contracts
- **ethers.js** library
- **Mumbai Testnet** (Polygon testnet)

## ⚙️ Cấu hình

### 1. **Environment Variables**
Tạo file `.env` trong thư mục gốc:

```bash
# Blockchain Configuration
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
PRIVATE_KEY=your_private_key_here

# Server Configuration
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

### 2. **Deploy Smart Contract**

#### **Option A: Sử dụng Remix IDE**
1. Truy cập [Remix IDE](https://remix.ethereum.org/)
2. Tạo file mới: `ProductTraceability.sol`
3. Copy nội dung từ `contracts/ProductTraceability.sol`
4. Compile contract
5. Deploy lên Mumbai Testnet
6. Copy contract address vào `.env`

#### **Option B: Sử dụng Hardhat**
```bash
# Cài đặt Hardhat
npm install --save-dev hardhat

# Khởi tạo project
npx hardhat init

# Deploy contract
npx hardhat run scripts/deploy.js --network mumbai
```

### 3. **Lấy Testnet MATIC**
1. Truy cập [Mumbai Faucet](https://faucet.polygon.technology/)
2. Nhập địa chỉ ví của bạn
3. Nhận test MATIC (miễn phí)

## 🔄 Workflow Blockchain

### **1. Tạo sản phẩm:**
```typescript
// 1. Tạo sản phẩm trong database local
const product = await ProductModel.create(productData);

// 2. Tạo blockchain hash
const blockchainHash = crypto
  .createHash('sha256')
  .update(JSON.stringify(blockchainData))
  .digest('hex');

// 3. Ghi lên blockchain (nếu available)
if (await blockchainService.isAvailable()) {
  await blockchainService.addProduct(productData);
  await blockchainService.verifyProduct(productId, blockchainHash);
}
```

### **2. Tạo QR Code:**
```typescript
// QR data bao gồm:
const qrData = {
  type: 'product_traceability',
  product_id: product.id,
  blockchain_hash: blockchainHash,
  blockchain_tx_hash: transactionHash, // Nếu có
  traceability_url: 'https://...',
  created_at: new Date().toISOString()
};
```

### **3. Verify sản phẩm:**
```typescript
// Đọc từ blockchain
const blockchainProduct = await blockchainService.getProduct(productId);
const verification = await blockchainService.getVerification(productId);

// So sánh với database local
const isVerified = blockchainProduct && verification.isVerified;
```

## 📊 API Endpoints

### **QR Code Generation**
```http
POST /api/qr/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qr_code": "data:image/png;base64...",
    "blockchain_hash": "abc123...",
    "blockchain_tx_hash": "0x123...",
    "blockchain_available": true,
    "traceability_url": "https://...",
    "product_info": {...}
  }
}
```

### **Product Traceability**
```http
GET /api/qr/traceability/:productId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {...},
    "farmer": {...},
    "orders": [...],
    "blockchain_verification": {
      "is_verified": true,
      "blockchain_available": true,
      "blockchain_product": {...},
      "blockchain_verification": {...}
    }
  }
}
```

### **Blockchain Status**
```http
GET /api/qr/blockchain/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "available": true,
    "productCount": "5",
    "verificationCount": "3",
    "network": "Polygon Mumbai",
    "contractAddress": "0x123..."
  }
}
```

## 🎯 UI Components

### **QRGenerator Component**
- Hiển thị QR code
- Trạng thái blockchain (Connected/Offline)
- Blockchain hash và transaction hash
- Link đến Polygon Explorer

### **Traceability Page**
- Thông tin sản phẩm từ blockchain
- Verification status
- Order history
- Blockchain verification details

## 🔍 Kiểm tra Blockchain

### **1. Kiểm tra trạng thái:**
```bash
curl http://localhost:8080/api/qr/blockchain/status
```

### **2. Tạo QR code:**
```bash
curl -X POST http://localhost:8080/api/qr/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1}'
```

### **3. Xem traceability:**
```bash
curl http://localhost:8080/api/qr/traceability/1
```

## 🚨 Troubleshooting

### **Blockchain không khả dụng:**
- Kiểm tra RPC URL
- Kiểm tra private key
- Kiểm tra contract address
- Kiểm tra network connection

### **Transaction failed:**
- Kiểm tra gas limit
- Kiểm tra gas price
- Kiểm tra MATIC balance
- Kiểm tra contract address

### **Smart contract error:**
- Kiểm tra ABI
- Kiểm tra function parameters
- Kiểm tra contract deployment

## 💰 Chi phí

### **Mumbai Testnet:**
- **Gas fee:** ~0.001-0.01 MATIC per transaction
- **MATIC miễn phí** từ faucet
- **Không tốn phí thật**

### **Mainnet (Production):**
- **Gas fee:** ~$0.01-0.1 per transaction
- **Cần MATIC thật**

## 🔐 Bảo mật

### **Private Key:**
- **KHÔNG** commit private key vào git
- Sử dụng environment variables
- Sử dụng hardware wallet cho production

### **Smart Contract:**
- Audit contract trước khi deploy mainnet
- Sử dụng proxy pattern cho upgrades
- Implement access control

## 📈 Monitoring

### **Blockchain Explorer:**
- [Polygon Mumbai Explorer](https://mumbai.polygonscan.com/)
- Theo dõi transactions
- Kiểm tra contract calls

### **Logs:**
```bash
# Xem logs blockchain
tail -f logs/blockchain.log

# Xem transaction logs
grep "blockchain" logs/app.log
```

## 🎉 Kết luận

Blockchain integration đã được triển khai thành công với:
- ✅ Smart contract cho product traceability
- ✅ QR code generation với blockchain hash
- ✅ Product verification trên blockchain
- ✅ Traceability API đọc từ blockchain
- ✅ UI hiển thị trạng thái blockchain

**Lưu ý:** Hiện tại đang sử dụng Mumbai Testnet. Để deploy production, cần:
1. Deploy contract lên Polygon Mainnet
2. Cập nhật contract address
3. Cập nhật RPC URL
4. Có MATIC để trả gas fee
