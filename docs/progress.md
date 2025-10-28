# Tiến độ tính năng AgroConnect

Cập nhật theo `docs/specs.md`:

## 3.1. Đăng ký & hồ sơ người dùng
- UC-01 Đăng ký/Đăng nhập: Có trang `client/pages/Auth.tsx` (Giao diện). API `server/routes/auth.ts` (Cơ bản).
- UC-02 Hồ sơ người dùng: Có `dashboard/ProfilePage.tsx` + API `server/routes/profile.ts`.
- UC-03 Xác thực ESG ID: Có trang review `dashboard/ESGReviewPage.tsx` và API `server/routes/esg.ts` (đầu mối). Chi tiết quy trình: Đang phát triển.

## 3.2. Nông dân / Hợp tác xã
- UC-10 Cập nhật mùa vụ: `dashboard/SeasonsPage.tsx`, API `server/routes/season.ts`.
- UC-11 Tải lên hình ảnh: `dashboard/ImagesPage.tsx`, API `server/routes/image.ts`.
- UC-12 Tạo sản phẩm nông sản: `dashboard/ProductsPage.tsx`, API `server/routes/product.ts`.
- UC-13 Nhận gợi ý đối tác: `dashboard/PartnersPage.tsx`, API `server/routes/partner.ts`.
- UC-14 Theo dõi đơn hàng: `dashboard/OrdersPage.tsx`, API `server/routes/order.ts`.

## 3.3. Doanh nghiệp thu mua
- UC-20 Đăng nhu cầu thu mua: Giao diện riêng chưa có; tạm thời chuyển hướng tới `PartnersPage`. Trạng thái: Đang phát triển.
- UC-21 Duyệt danh sách nhà cung cấp: Bộ lọc/giao diện chuyên sâu chưa có. Trạng thái: Đang phát triển.
- UC-22 Ký hợp đồng điện tử: Chưa có trang/flow ký hợp đồng. Trạng thái: Đang phát triển.
- UC-23 Xem báo cáo ESG: Có `dashboard/ESGPage.tsx` (UI) sử dụng dữ liệu từ `esg` (cơ bản).

## 3.4. Truy xuất nguồn gốc (Blockchain + QR Code)
- UC-30 Sinh mã QR sản phẩm: Có trang `client/pages/QRDemo.tsx` + components `QRGenerator`, `SimpleQRScanner`.
- UC-31 Dữ liệu truy xuất: Có trang `Traceability.tsx` và API `server/routes/qr.ts` (cơ bản).
- UC-32 Quét QR hiển thị hành trình: Có qua `QRDemo` + `SimpleQRScanner`. Hành trình chi tiết: Đang phát triển.
- UC-33 Bảo toàn dữ liệu (Blockchain): Có hợp đồng `contracts/ProductTraceability.sol` và service `server/services/blockchain.ts`. Tích hợp sâu: Đang phát triển.

## 3.5. Hệ thống chấm điểm ESG
- UC-40/41/42 ESG (E/S/G): Có trang `ESGPage` (UI). Chấm điểm chi tiết & thang điểm: Đang phát triển.
- UC-43 Xác minh ESG: Có `ESGReviewPage` (UI) + API `esg`. Luồng xác minh: Đang phát triển.
- UC-44 Xuất chứng nhận ESG: Chưa có xuất PDF + mã định danh. Trạng thái: Đang phát triển.

## 3.6. Cổng dữ liệu thị trường & đào tạo trực tuyến
- UC-50 Khóa học ESG trực tuyến: Chưa có. Trạng thái: Đang phát triển.
- UC-51 Bảng giá thị trường: Chưa có. Trạng thái: Đang phát triển.
- UC-52 Gợi ý mùa vụ tối ưu (AI): Chưa có. Trạng thái: Đang phát triển.
- UC-53 Diễn đàn cộng đồng: Chưa có. Trạng thái: Đang phát triển.

---

## Điều hướng & trang hỗ trợ
- Route chính cấu hình trong `client/App.tsx` (React Router 6). Đã bổ sung:
  - `/features` – Danh mục UC với nút điều hướng; những UC chưa có sẽ mở trang WIP.
  - `/wip` – Component "Tính năng đang phát triển".
  - Trang 404: `client/pages/NotFound.tsx` (đã Việt hoá và bổ sung liên kết).

## Ghi chú
- Các API cơ bản đã có: `auth`, `profile`, `esg`, `season`, `image`, `product`, `partner`, `order`, `qr`.
- Nhiều luồng nghiệp vụ chuyên sâu (ký hợp đồng, PDF chứng nhận, AI gợi ý, thị trường) đang trong trạng thái placeholder/WIP.


