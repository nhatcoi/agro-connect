# Agro Connect - Docker Hub Usage

## 🐳 Docker Image Information

**Repository**: `noahdev206/agro-connect`  
**Tag**: `latest`  
**Size**: ~1.03GB  
**Architecture**: Multi-platform (AMD64/ARM64)

## 🚀 Quick Start

### 1. Pull và chạy container

```bash
# Pull image từ Docker Hub
docker pull noahdev206/agro-connect:latest

# Chạy container với port mapping
docker run -d \
  --name agro-connect \
  -p 8087:3007 \
  -e NODE_ENV=production \
  -e PORT=3007 \
  -e PING_MESSAGE=ping \
  noahdev206/agro-connect:latest
```

### 2. Chạy với volume cho database

```bash
# Tạo volume cho database
docker volume create agro-connect-db

# Chạy container với volume
docker run -d \
  --name agro-connect \
  -p 8087:3007 \
  -v agro-connect-db:/app/server/database \
  -e NODE_ENV=production \
  -e PORT=3007 \
  -e PING_MESSAGE=ping \
  noahdev206/agro-connect:latest
```

### 3. Chạy với restart policy

```bash
docker run -d \
  --name agro-connect \
  -p 8087:3007 \
  -v agro-connect-db:/app/server/database \
  -e NODE_ENV=production \
  -e PORT=3007 \
  -e PING_MESSAGE=ping \
  --restart unless-stopped \
  noahdev206/agro-connect:latest
```

## 🌐 Access Application

Sau khi container chạy thành công, truy cập:

- **Main App**: http://localhost:8087
- **API**: http://localhost:8087/api
- **Health Check**: http://localhost:8087/api/health

## 🔧 Management Commands

### Kiểm tra trạng thái
```bash
# Xem containers đang chạy
docker ps

# Xem logs
docker logs agro-connect

# Xem logs real-time
docker logs -f agro-connect
```

### Quản lý container
```bash
# Dừng container
docker stop agro-connect

# Khởi động lại container
docker start agro-connect

# Xóa container
docker rm agro-connect

# Xóa container và volume
docker rm -v agro-connect
```

### Test API
```bash
# Test ping endpoint
curl http://localhost:8087/api/ping

# Test health check
curl http://localhost:8087/api/health
```

## 📋 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node.js environment |
| `PORT` | `3007` | Port container lắng nghe |
| `PING_MESSAGE` | `ping` | Ping response message |

## 🗄️ Database

- **Type**: SQLite
- **Location**: `/app/server/database` (trong container)
- **Volume**: `agro-connect-db` (khuyến nghị)

## 🏗️ Architecture

- **Frontend**: React + Vite (Static files)
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Blockchain**: Disabled (for stability)

## 🔍 Troubleshooting

### Container không khởi động
```bash
# Xem logs chi tiết
docker logs agro-connect

# Kiểm tra port có bị xung đột không
netstat -tulpn | grep 8087
```

### Không truy cập được ứng dụng
```bash
# Kiểm tra container có chạy không
docker ps

# Test từ bên trong container
docker exec agro-connect curl http://localhost:3007/api/ping
```

### Reset hoàn toàn
```bash
# Dừng và xóa container
docker stop agro-connect
docker rm agro-connect

# Xóa volume (mất dữ liệu)
docker volume rm agro-connect-db

# Chạy lại
docker run -d --name agro-connect -p 8087:3007 noahdev206/agro-connect:latest
```

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Docker đã cài đặt và chạy
2. Port 8087 không bị sử dụng
3. Container logs để xem lỗi chi tiết

---

**Agro Connect** - Empowering Sustainable Agriculture Vietnam 🌱
