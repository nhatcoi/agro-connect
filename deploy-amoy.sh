#!/bin/bash

# 🚀 Script triển khai Polygon Amoy
echo "🚀 Triển khai Polygon Amoy Testnet..."

# Kiểm tra file .env
if [ ! -f .env ]; then
    echo "📝 Tạo file .env..."
    cat > .env << EOF
# Polygon Amoy Configuration
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
PRIVATE_KEY=your_private_key_here

# Server Configuration
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
EOF
    echo "✅ File .env đã được tạo!"
    echo "⚠️  Vui lòng cập nhật PRIVATE_KEY và CONTRACT_ADDRESS trong file .env"
else
    echo "✅ File .env đã tồn tại!"
fi

# Kiểm tra blockchain status
echo "🔍 Kiểm tra blockchain status..."
curl -s -X GET "http://localhost:8080/api/qr/blockchain/status" | jq '.'

echo ""
echo "🎯 Hướng dẫn tiếp theo:"
echo "1. Tạo ví MetaMask: https://metamask.io/"
echo "2. Lấy test MATIC: https://faucet.polygon.technology/"
echo "3. Deploy contract: https://remix.ethereum.org/"
echo "4. Cập nhật .env với PRIVATE_KEY và CONTRACT_ADDRESS"
echo "5. Restart server: pnpm dev"
echo ""
echo "🚀 Sẵn sàng triển khai!"
