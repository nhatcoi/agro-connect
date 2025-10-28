import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { QrCode, Leaf, Users, Building2, FileCheck2, ScanLine, MapPin, FileSignature, ShieldCheck, BookOpen, ShoppingBasket, Image as ImageIcon, Boxes, Handshake, ClipboardList, Activity } from "lucide-react";

type FeatureItem = {
  code: string;
  title: string;
  desc: string;
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function Features() {
  const navigate = useNavigate();

  const items: FeatureItem[] = [
    // 3.1 Đăng ký & hồ sơ
    { code: "UC-01", title: "Đăng ký / Đăng nhập", desc: "Tạo tài khoản & xác thực.", to: "/auth", icon: Users },
    { code: "UC-02", title: "Hồ sơ người dùng", desc: "Thông tin cá nhân, vai trò, chứng nhận.", to: "/me/profile", icon: Leaf },
    { code: "UC-03", title: "Xác thực ESG ID", desc: "Gắn mã định danh ESG.", to: "/me/review", icon: ShieldCheck },

    // 3.2 Nông dân/HTX
    { code: "UC-10", title: "Cập nhật mùa vụ", desc: "Ghi nhật ký canh tác.", to: "/me/seasons", icon: MapPin },
    { code: "UC-11", title: "Tải ảnh thực địa", desc: "Ảnh nông sản, chứng nhận.", to: "/me/images", icon: ImageIcon },
    { code: "UC-12", title: "Tạo sản phẩm", desc: "Khai báo lô hàng nông sản.", to: "/me/products", icon: Boxes },
    { code: "UC-13", title: "Gợi ý đối tác", desc: "Matching theo vị trí & tiêu chuẩn.", to: "/me/partners", icon: Handshake },
    { code: "UC-14", title: "Theo dõi đơn hàng", desc: "Quản lý giao dịch.", to: "/me/orders", icon: ShoppingBasket },

    // 3.3 Doanh nghiệp
    { code: "UC-20", title: "Đăng nhu cầu thu mua", desc: "Yêu cầu tiêu chuẩn, số lượng.", icon: ClipboardList },
    { code: "UC-21", title: "Duyệt nhà cung cấp", desc: "Bộ lọc tiêu chuẩn – vị trí – giá.", icon: Building2 },
    { code: "UC-22", title: "Ký hợp đồng điện tử", desc: "Ký online, lưu Blockchain.", icon: FileSignature },
    { code: "UC-23", title: "Xem báo cáo ESG", desc: "Báo cáo đánh giá ESG nhà cung cấp.", to: "/me/esg", icon: FileCheck2 },

    // 3.4 Truy xuất (Blockchain + QR)
    { code: "UC-30", title: "Sinh mã QR sản phẩm", desc: "Mỗi lô hàng có QR truy xuất.", to: "/qr-demo", icon: QrCode },
    { code: "UC-31", title: "Dữ liệu truy xuất", desc: "GPS, phân bón, ngày thu hoạch...", to: "/traceability/1", icon: ScanLine },
    { code: "UC-32", title: "Quét QR hiển thị hành trình", desc: "From Farm to Table.", to: "/qr-demo", icon: ScanLine },
    { code: "UC-33", title: "Bảo toàn dữ liệu", desc: "Blockchain đảm bảo integrity.", icon: ShieldCheck },

    // 3.5 ESG Scoring
    { code: "UC-40", title: "Environment", desc: "CO₂, nước, rác thải...", to: "/me/esg", icon: Leaf },
    { code: "UC-41", title: "Social", desc: "Bình đẳng giới, an toàn...", to: "/me/esg", icon: Users },
    { code: "UC-42", title: "Governance", desc: "Minh bạch dữ liệu...", to: "/me/esg", icon: FileCheck2 },
    { code: "UC-43", title: "Xác minh ESG", desc: "Chuyên gia kiểm định.", to: "/me/review", icon: ShieldCheck },
    { code: "UC-44", title: "Xuất chứng nhận ESG", desc: "PDF + mã định danh.", icon: FileCheck2 },

    // 3.6 Đào tạo & thị trường
    { code: "UC-50", title: "Khóa học ESG trực tuyến", desc: "Học liệu & khoá học.", icon: BookOpen },
    { code: "UC-51", title: "Bảng giá thị trường", desc: "Giá nông sản theo vùng.", icon: Activity },
    { code: "UC-52", title: "Gợi ý mùa vụ tối ưu", desc: "AI đề xuất mùa vụ.", icon: Leaf },
    { code: "UC-53", title: "Diễn đàn cộng đồng", desc: "Hỏi – đáp cùng chuyên gia.", icon: Users },
  ];

  const go = (item: FeatureItem) => {
    if (item.to) {
      navigate(item.to);
    } else {
      const params = new URLSearchParams({ title: `${item.code} – Tính năng đang phát triển`, desc: item.desc });
      navigate(`/wip?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Danh mục chức năng</h1>
          <Button variant="outline" onClick={() => navigate("/me")}>Trang chủ</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.code} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3">
                <item.icon className="w-5 h-5 text-agro-green" />
                <CardTitle className="text-base">{item.code} – {item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                <Button size="sm" onClick={() => go(item)}>Mở</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


