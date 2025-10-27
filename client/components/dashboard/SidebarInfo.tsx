import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Shield, 
  Sprout, 
  Image, 
  Package, 
  Users, 
  ShoppingCart,
  Home,
  Activity
} from 'lucide-react';
import { useFontFamily } from '@/hooks/useFontFamily';

const SidebarInfo: React.FC = () => {
  const { getFontFamily } = useFontFamily();

  const sidebarStructure = [
    {
      group: 'Thông tin chung',
      icon: <Home className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-800',
      items: [
        { id: 'UC-02', name: 'Hồ sơ người dùng', icon: <User className="w-4 h-4" />, description: 'Hiển thị thông tin cá nhân, vai trò, chứng nhận, vị trí (GPS), và lịch sử hoạt động' },
        { id: 'UC-03', name: 'Xác thực ESG ID', icon: <Shield className="w-4 h-4" />, description: 'Gắn "Mã định danh ESG" cho người dùng sau khi được xác minh bởi cố vấn' }
      ]
    },
    {
      group: 'Phân hệ nông dân',
      icon: <Sprout className="w-4 h-4" />,
      color: 'bg-green-100 text-green-800',
      items: [
        { id: 'UC-10', name: 'Cập nhật mùa vụ', icon: <Sprout className="w-4 h-4" />, description: 'Ghi lại thông tin canh tác, loại cây trồng, thời gian gieo trồng, phân bón, thuốc BVTV' },
        { id: 'UC-11', name: 'Tải lên hình ảnh thực địa', icon: <Image className="w-4 h-4" />, description: 'Ảnh nông sản, nhật ký canh tác, chứng nhận (VietGAP, GlobalGAP, ESG)' },
        { id: 'UC-12', name: 'Tạo sản phẩm nông sản', icon: <Package className="w-4 h-4" />, description: 'Khai báo tên, khối lượng, vùng trồng, tiêu chuẩn chất lượng' },
        { id: 'UC-13', name: 'Nhận gợi ý đối tác', icon: <Users className="w-4 h-4" />, description: 'Thuật toán "match" gợi ý doanh nghiệp phù hợp dựa trên tiêu chuẩn và vị trí' },
        { id: 'UC-14', name: 'Theo dõi đơn hàng', icon: <ShoppingCart className="w-4 h-4" />, description: 'Quản lý các đơn hàng đang đàm phán hoặc giao dịch' }
      ]
    },
    {
      group: 'Phân hệ doanh nghiệp',
      icon: <Package className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-800',
      items: [
        { id: 'UC-20', name: 'Đăng nhu cầu thu mua', icon: <Package className="w-4 h-4" />, description: 'Nhập loại nông sản, tiêu chuẩn mong muốn (VietGAP, hữu cơ, ESG Level B+)' },
        { id: 'UC-21', name: 'Duyệt danh sách nhà cung cấp', icon: <Users className="w-4 h-4" />, description: 'Xem danh sách nông dân/HTX phù hợp theo bộ lọc tiêu chuẩn – vị trí – giá' },
        { id: 'UC-22', name: 'Ký hợp đồng điện tử', icon: <Shield className="w-4 h-4" />, description: 'Hệ thống cung cấp mẫu hợp đồng chuẩn, có thể ký online và lưu trên Blockchain' },
        { id: 'UC-23', name: 'Xem báo cáo ESG', icon: <Shield className="w-4 h-4" />, description: 'Báo cáo đánh giá ESG của nhà cung cấp: phát thải, an toàn, truy xuất minh bạch' }
      ]
    },
    {
      group: 'Phân hệ chuyên gia ESG',
      icon: <Shield className="w-4 h-4" />,
      color: 'bg-orange-100 text-orange-800',
      items: [
        { id: 'ESG-REVIEW', name: 'Duyệt ESG', icon: <Shield className="w-4 h-4" />, description: 'Duyệt và xác thực các yêu cầu ESG của người dùng' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${getFontFamily('heading')} mb-2`}>
          Cấu trúc Sidebar Dashboard
        </h2>
        <p className="text-muted-foreground">
          Sidebar được tổ chức theo nhóm chức năng để dễ dàng điều hướng và quản lý
        </p>
      </div>

      <div className="grid gap-6">
        {sidebarStructure.map((group, groupIndex) => (
          <Card key={groupIndex}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${group.color}`}>
                  {group.icon}
                </div>
                <span>{group.group}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0 mt-1">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {item.id}
                        </Badge>
                        <h4 className={`font-medium ${getFontFamily('body')}`}>
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Activity className="w-5 h-5" />
            <span>Hoạt động</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tab hoạt động hiển thị lịch sử hoạt động và thông báo của người dùng
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarInfo;
