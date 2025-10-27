🧩 ĐẶC TẢ CHỨC NĂNG – ỨNG DỤNG SỐ AGROCONNECT APP/WEB
1. Mục tiêu hệ thống

Ứng dụng AgroConnect App/Web là nền tảng trung tâm giúp kết nối trực tuyến nông dân – hợp tác xã – doanh nghiệp – người tiêu dùng, thông qua công nghệ Blockchain, QR truy xuất nguồn gốc và ESG Scoring.
Hệ thống hướng đến tăng tính minh bạch, giảm trung gian và thúc đẩy nông nghiệp bền vững.

2. Kiến trúc tổng thể - MVP

Mô hình 3 lớp (Three-tier Architecture):

Frontend: Web App ReactJs

Backend: ExpressJs

Database: SQLite + Blockchain ledger.

3. Các phân hệ chức năng chính
3.1. Phân hệ đăng ký và hồ sơ người dùng

Mô tả: Cho phép các bên (nông dân, doanh nghiệp, người tiêu dùng, chuyên gia ESG) tạo và quản lý tài khoản.

Mã	Chức năng	Mô tả chi tiết
UC-01	Đăng ký tài khoản	Người dùng tạo tài khoản bằng email, số điện thoại hoặc tài khoản xã hội. Chọn vai trò: Nông dân / Doanh nghiệp / Người tiêu dùng / Chuyên gia ESG.
UC-02	Hồ sơ người dùng	Hiển thị thông tin cá nhân, vai trò, chứng nhận, vị trí (GPS), và lịch sử hoạt động.
UC-03	Xác thực ESG ID	Gắn “Mã định danh ESG” cho người dùng sau khi được xác minh bởi cố vấn.
3.2. Phân hệ nông dân / hợp tác xã
Mã	Chức năng	Mô tả chi tiết
UC-10	Cập nhật mùa vụ	Ghi lại thông tin canh tác, loại cây trồng, thời gian gieo trồng, phân bón, thuốc BVTV.
UC-11	Tải lên hình ảnh thực địa	Ảnh nông sản, nhật ký canh tác, chứng nhận (VietGAP, GlobalGAP, ESG).
UC-12	Tạo sản phẩm nông sản	Khai báo tên, khối lượng, vùng trồng, tiêu chuẩn chất lượng.
UC-13	Nhận gợi ý đối tác	Thuật toán “match” gợi ý doanh nghiệp phù hợp dựa trên tiêu chuẩn và vị trí.
UC-14	Theo dõi đơn hàng	Quản lý các đơn hàng đang đàm phán hoặc giao dịch.
3.3. Phân hệ doanh nghiệp thu mua
Mã	Chức năng	Mô tả chi tiết
UC-20	Đăng nhu cầu thu mua	Nhập loại nông sản, tiêu chuẩn mong muốn (VietGAP, hữu cơ, ESG Level B+).
UC-21	Duyệt danh sách nhà cung cấp	Xem danh sách nông dân/HTX phù hợp theo bộ lọc tiêu chuẩn – vị trí – giá.
UC-22	Ký hợp đồng điện tử	Hệ thống cung cấp mẫu hợp đồng chuẩn, có thể ký online và lưu trên Blockchain.
UC-23	Xem báo cáo ESG	Báo cáo đánh giá ESG của nhà cung cấp: phát thải, an toàn, truy xuất minh bạch.
3.4. Hệ thống truy xuất nguồn gốc (Blockchain + QR Code)
Mã	Chức năng	Mô tả chi tiết
UC-30	Sinh mã QR sản phẩm	Mỗi lô hàng có mã QR chứa thông tin truy xuất được ghi trên Blockchain.
UC-31	Dữ liệu truy xuất	Lưu trữ: tên nông hộ, vị trí GPS, loại phân bón, ngày thu hoạch, điểm ESG, đơn vị vận chuyển.
UC-32	Quét QR hiển thị hành trình	Người tiêu dùng quét QR → hiển thị “From Farm to Table Journey” (hành trình nông sản).
UC-33	Bảo toàn dữ liệu	Blockchain đảm bảo dữ liệu không thể sửa, hỗ trợ xác thực ngược chiều (reverse trace).
3.5. Hệ thống chấm điểm ESG (AgroConnect ESG Score)
Mã	Nhóm tiêu chí	Mô tả đánh giá
UC-40	E – Environment	Lượng phát thải CO₂, sử dụng phân bón, xử lý rác thải, tiết kiệm nước.
UC-41	S – Social	Bình đẳng giới, an toàn lao động, mức độ tham gia cộng đồng.
UC-42	G – Governance	Minh bạch dữ liệu, tuân thủ pháp lý, truy xuất thông tin chính xác.
UC-43	Xác minh ESG	Chuyên gia ESG hoặc cố vấn xác minh điểm số qua dashboard kiểm định.
UC-44	Xuất chứng nhận ESG	Hệ thống sinh “AgroConnect ESG Certificate” dạng PDF + mã định danh Blockchain.
3.6. Cổng dữ liệu thị trường & đào tạo trực tuyến
Mã	Chức năng	Mô tả chi tiết
UC-50	Khóa học ESG trực tuyến	Các khóa học về canh tác xanh, chuyển đổi số, kỹ thuật truy xuất.
UC-51	Bảng giá thị trường	Bảng giá nông sản theo vùng – loại sản phẩm – mùa vụ, cập nhật theo thời gian thực.
UC-52	Gợi ý mùa vụ tối ưu	AI gợi ý loại cây phù hợp dựa trên thời tiết, thổ nhưỡng và nhu cầu doanh nghiệp.
UC-53	Diễn đàn cộng đồng	Nông dân trao đổi kinh nghiệm, hỏi – đáp cùng chuyên gia.
4. Quy trình nghiệp vụ chính (Business Flow)
🔹 Quy trình kết nối giao dịch (Match Flow)

Nông dân đăng sản phẩm → xác thực ESG.

Doanh nghiệp đăng nhu cầu thu mua.

Hệ thống “matching engine” gợi ý kết nối dựa trên vị trí, tiêu chuẩn, giá.

Hai bên trao đổi, ký hợp đồng điện tử.

Hệ thống tự động sinh QR truy xuất cho lô hàng → lưu Blockchain.

Người tiêu dùng quét QR → xem hành trình nông sản.

5. Yêu cầu phi chức năng (Non-functional)
Nhóm yêu cầu	Mô tả
Hiệu năng	Thời gian phản hồi API < 2 giây cho truy vấn dữ liệu thông thường.
Bảo mật	Dữ liệu truy xuất được mã hóa AES-256, Blockchain immutable.
Tương thích	Hỗ trợ trình duyệt web, Android, iOS.
Mở rộng	Có thể thêm module “Weather API”, “Logistics Tracking”, “ESG Dashboard”.
Khả năng tích hợp	Hỗ trợ API kết nối với hệ thống VietGAP, FAO, GIZ, VinCommerce.
6. Đầu ra dự kiến

Giao diện Web/App thân thiện, dễ sử dụng cho người ít hiểu biết công nghệ.

Hệ thống truy xuất nông sản minh bạch, có thể chứng minh nguồn gốc.

Cộng đồng nông nghiệp số, chia sẻ kiến thức và kết nối giao thương.

Bộ dữ liệu ESG chuẩn hóa, phục vụ phân tích và báo cáo phát triển bền vững.