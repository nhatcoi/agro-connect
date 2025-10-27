# 🚀 Triển khai trên Polygon Amoy Testnet

## 🎯 **Tại sao chọn Polygon Amoy?**

- ✅ **Testnet mới nhất** của Polygon
- ✅ **Gas fee cực thấp** (gần như miễn phí)
- ✅ **Tốc độ nhanh** và ổn định
- ✅ **Tương thích hoàn toàn** với Polygon Mainnet
- ✅ **RPC miễn phí** và không giới hạn

## 🔧 **Bước 1: Cấu hình Environment**

### **Tạo file `.env`:**
```bash
# Polygon Amoy Configuration
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
PRIVATE_KEY=your_private_key_here

# Server Configuration
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

## 🔐 **Bước 2: Tạo Ví Ethereum**

### **Option A: MetaMask (Khuyến nghị)**
1. **Cài MetaMask:** https://metamask.io/
2. **Tạo ví mới:**
   - Click "Create a new wallet"
   - Đặt mật khẩu mạnh
   - Lưu seed phrase an toàn
3. **Lấy private key:**
   - Click vào 3 chấm → Account Details
   - Export Private Key
   - **Copy private key** (bắt đầu bằng 0x)

### **Option B: Tạo ví bằng code**
```bash
# Cài đặt ethereumjs-wallet
npm install -g ethereumjs-wallet

# Tạo ví mới
node -e "
const Wallet = require('ethereumjs-wallet');
const wallet = Wallet.generate();
console.log('Address:', wallet.getAddressString());
console.log('Private Key:', wallet.getPrivateKeyString());
console.log('Seed Phrase:', wallet.getMnemonic());
"
```

## 💰 **Bước 3: Lấy Test MATIC**

### **Faucet Amoy:**
```
https://faucet.polygon.technology/
```

### **Cách lấy:**
1. **Paste địa chỉ ví** (bắt đầu bằng 0x)
2. **Chọn network:** Polygon Amoy
3. **Nhấn "Submit"**
4. **Nhận test MATIC** (miễn phí)

### **Kiểm tra balance:**
```bash
# Kiểm tra balance
curl -X POST "https://rpc-amoy.polygon.technology" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": ["0xYOUR_ADDRESS", "latest"],
    "id": 1
  }'
```

## 📄 **Bước 4: Deploy Smart Contract**

### **Sử dụng Remix IDE:**

#### **4.1. Truy cập Remix:**
```
https://remix.ethereum.org/
```

#### **4.2. Tạo file contract:**
- Tạo file mới: `ProductTraceability.sol`
- Copy nội dung từ `contracts/ProductTraceability.sol`

#### **4.3. Compile contract:**
- Chọn compiler: `0.8.19`
- Compile contract
- Kiểm tra không có lỗi

#### **4.4. Deploy lên Amoy:**
- Chọn environment: `Injected Provider - MetaMask`
- Chọn network: `Polygon Amoy`
- Deploy contract
- **Copy contract address** (bắt đầu bằng 0x)

### **Sử dụng Hardhat (Advanced):**

#### **4.1. Cài đặt Hardhat:**
```bash
npm install --save-dev hardhat
npx hardhat init
```

#### **4.2. Cấu hình hardhat.config.js:**
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80002
    }
  }
};
```

#### **4.3. Deploy contract:**
```bash
npx hardhat run scripts/deploy.js --network amoy
```

## ⚙️ **Bước 5: Cập nhật Environment**

### **Cập nhật file `.env`:**
```bash
# Polygon Amoy Configuration
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
CONTRACT_ADDRESS=0x1234567890abcdef... # Address sau khi deploy
PRIVATE_KEY=0xabcdef1234567890... # Private key từ MetaMask

# Server Configuration
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

## 🚀 **Bước 6: Test Blockchain**

### **Restart server:**
```bash
pnpm dev
```

### **Kiểm tra blockchain status:**
```bash
curl -X GET "http://localhost:8080/api/qr/blockchain/status"
```

### **Kết quả mong đợi:**
```json
{
  "success": true,
  "data": {
    "available": true,
    "productCount": "0",
    "verificationCount": "0",
    "network": "Polygon Amoy",
    "contractAddress": "0x123..."
  }
}
```

## 🎯 **Bước 7: Test QR Code với Blockchain**

### **Tạo sản phẩm và QR code:**
1. **Truy cập:** `http://localhost:8080/dashboard/products`
2. **Tạo sản phẩm mới**
3. **Nhấn "QR Code"**
4. **Kiểm tra kết quả:**
   - 🟢 **"Blockchain Connected"**
   - ✅ **Transaction Hash** hiển thị
   - 🔗 **Link đến Amoy Explorer**

## 📊 **So sánh Amoy vs Mumbai:**

| Tính năng | Mumbai | Amoy |
|-----------|--------|------|
| **Gas Fee** | ~0.001-0.01 MATIC | ~0.0001-0.001 MATIC |
| **Tốc độ** | Nhanh | Rất nhanh |
| **Ổn định** | Tốt | Tốt hơn |
| **RPC** | Có giới hạn | Không giới hạn |
| **Explorer** | mumbai.polygonscan.com | amoy.polygonscan.com |

## 🔧 **Troubleshooting:**

### **Lỗi thường gặp:**
- **"Invalid private key"** → Kiểm tra format (0x...)
- **"Contract not found"** → Kiểm tra contract address
- **"Insufficient funds"** → Lấy thêm test MATIC
- **"Network error"** → Kiểm tra RPC URL

### **Kiểm tra kết nối:**
```bash
# Test RPC connection
curl -X POST "https://rpc-amoy.polygon.technology" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

## 🎉 **Kết quả cuối cùng:**

### **Trước (Offline):**
- 🟡 **"Blockchain Offline"**
- ❌ **Transaction Hash:** null
- ❌ **Explorer Link:** không có

### **Sau (Amoy Connected):**
- 🟢 **"Blockchain Connected"**
- ✅ **Transaction Hash:** 0x123...
- ✅ **Explorer Link:** https://amoy.polygonscan.com/tx/0x123...
- 💰 **Gas Fee:** Cực thấp (~0.0001 MATIC)

## 🚀 **Sẵn sàng triển khai!**

**Polygon Amoy** là lựa chọn tốt nhất cho:
- ✅ **Development** - Gas fee thấp
- ✅ **Testing** - Tốc độ nhanh
- ✅ **Production** - Tương thích mainnet
- ✅ **Cost-effective** - Gần như miễn phí

**Bắt đầu triển khai ngay!** 🎯
