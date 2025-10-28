import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Shield, 
  Sprout, 
  Image, 
  Package, 
  Users, 
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Home,
  Activity,
  ClipboardList,
  FileSignature,
  BookOpen
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFontFamily } from '@/hooks/useFontFamily';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string;
  children?: SidebarItem[];
}

interface DashboardSidebarProps {
  userRole: string;
  className?: string;
  onNavigate?: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  userRole,
  className,
  onNavigate
}) => {
  const { t } = useTranslation();
  const { getFontFamily } = useFontFamily();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set(['general', 'farmer']));
  
  const activeTab = location.pathname.split('/')[2] || 'profile';

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const sidebarItems: SidebarItem[] = [
    {
      id: 'general',
      label: 'Thông tin chung',
      icon: <Home className="w-4 h-4" />,
      children: [
        {
          id: 'profile',
          label: 'Hồ sơ cá nhân',
          icon: <User className="w-4 h-4" />,
          href: '/me/profile'
        },
        {
          id: 'esg',
          label: 'Xác thực ESG',
          icon: <Shield className="w-4 h-4" />,
          href: '/me/esg'
        }
      ]
    }
  ];

  // Add farmer-specific items
  if (userRole === 'farmer') {
    sidebarItems.push({
      id: 'farmer',
      label: 'Phân hệ nông dân',
      icon: <Sprout className="w-4 h-4" />,
      children: [
        {
          id: 'seasons',
          label: 'Mùa vụ',
          icon: <Sprout className="w-4 h-4" />,
          href: '/me/seasons'
        },
        {
          id: 'images',
          label: 'Hình ảnh thực địa',
          icon: <Image className="w-4 h-4" />,
          href: '/me/images'
        },
        {
          id: 'products',
          label: 'Sản phẩm nông sản',
          icon: <Package className="w-4 h-4" />,
          href: '/me/products'
        },
        {
          id: 'partners',
          label: 'Gợi ý đối tác',
          icon: <Users className="w-4 h-4" />,
          href: '/me/partners'
        },
        {
          id: 'orders',
          label: 'Theo dõi đơn hàng',
          icon: <ShoppingCart className="w-4 h-4" />,
          href: '/me/orders'
        }
      ]
    });
  }

  // Add business-specific items
  if (userRole === 'business') {
    sidebarItems.push({
      id: 'business',
      label: 'Phân hệ doanh nghiệp',
      icon: <Package className="w-4 h-4" />,
      children: [
        {
          id: 'uc-20',
          label: 'Đăng nhu cầu thu mua',
          icon: <ClipboardList className="w-4 h-4" />,
          href: '/wip?title=UC-20%20%E2%80%93%20T%C3%ADnh%20n%C4%83ng%20%C4%91ang%20ph%C3%A1t%20tri%E1%BB%83n&desc=%C4%90%C4%83ng%20nhu%20c%E1%BA%A7u%20thu%20mua%20v%E1%BB%9Bi%20ti%C3%AAu%20chu%E1%BA%A9n%2C%20s%E1%BB%91%20l%C6%B0%E1%BB%A3ng'
        },
        {
          id: 'uc-21',
          label: 'Duyệt nhà cung cấp',
          icon: <Users className="w-4 h-4" />,
          href: '/wip?title=UC-21%20%E2%80%93%20T%C3%ADnh%20n%C4%83ng%20%C4%91ang%20ph%C3%A1t%20tri%E1%BB%83n&desc=B%E1%BB%99%20l%E1%BB%8Dc%20ti%C3%AAu%20chu%E1%BA%A9n%20%E2%80%93%20v%E1%BB%8B%20tr%C3%AD%20%E2%80%93%20gi%C3%A1'
        },
        {
          id: 'uc-22',
          label: 'Ký hợp đồng điện tử',
          icon: <FileSignature className="w-4 h-4" />,
          href: '/wip?title=UC-22%20%E2%80%93%20T%C3%ADnh%20n%C4%83ng%20%C4%91ang%20ph%C3%A1t%20tri%E1%BB%83n&desc=K%C3%BD%20online%2C%20l%C6%B0u%20tr%C3%AAn%20Blockchain'
        },
        {
          id: 'partners',
          label: 'Gợi ý đối tác',
          icon: <Users className="w-4 h-4" />,
          href: '/me/partners'
        },
        {
          id: 'orders',
          label: 'Theo dõi đơn hàng',
          icon: <ShoppingCart className="w-4 h-4" />,
          href: '/me/orders'
        }
      ]
    });
  }

  // Add ESG expert-specific items
  if (userRole === 'esg_expert') {
    sidebarItems.push({
      id: 'esg_expert',
      label: 'Phân hệ chuyên gia ESG',
      icon: <Shield className="w-4 h-4" />,
      children: [
        {
          id: 'review',
          label: 'Duyệt ESG',
          icon: <Shield className="w-4 h-4" />,
          href: '/me/review'
        }
      ]
    });
  }

  // Add activity tab for all users
  sidebarItems.push(    {
      id: 'activity',
      label: 'Hoạt động',
      icon: <Activity className="w-4 h-4" />,
      href: '/me/activity'
    });

  // Traceability group (real entries + WIP entries)
  sidebarItems.push({
    id: 'trace',
    label: 'Truy xuất nguồn gốc',
    icon: <Shield className="w-4 h-4" />,
    children: [
      {
        id: 'qr-generate',
        label: 'Sinh mã QR sản phẩm',
        icon: <ClipboardList className="w-4 h-4" />,
        href: '/qr-demo'
      },
      {
        id: 'trace-data',
        label: 'Dữ liệu truy xuất',
        icon: <ClipboardList className="w-4 h-4" />,
        href: '/traceability/1'
      },
      {
        id: 'trace-journey',
        label: 'Hành trình From Farm to Table',
        icon: <ClipboardList className="w-4 h-4" />,
        href: '/qr-demo'
      },
      {
        id: 'uc-33',
        label: 'Bảo toàn dữ liệu (Blockchain)',
        icon: <Shield className="w-4 h-4" />,
        href: '/wip?title=UC-33%20%E2%80%93%20T%C3%ADnh%20n%C4%83ng%20%C4%91ang%20ph%C3%A1t%20tri%E1%BB%83n&desc=Blockchain%20%C4%91%E1%BA%A3m%20b%E1%BA%A3o%20t%C3%ADnh%20to%C3%A0n%20v%E1%BA%B9n'
      }
    ]
  });

  // ESG Certificate quick access
  sidebarItems.push({
    id: 'esg_certificate',
    label: 'Chứng nhận ESG',
    icon: <Shield className="w-4 h-4" />,
    href: '/wip?title=UC-44%20%E2%80%93%20T%C3%ADnh%20n%C4%83ng%20%C4%91ang%20ph%C3%A1t%20tri%E1%BB%83n&desc=Sinh%20PDF%20v%C3%A0%20m%C3%A3%20%C4%91%E1%BB%8Bnh%20danh%20Blockchain'
  });

  // Market & Training group
  sidebarItems.push({
    id: 'market_training',
    label: 'Thị trường & Đào tạo',
    icon: <Activity className="w-4 h-4" />,
    children: [
      {
        id: 'uc-50',
        label: 'Khóa học ESG trực tuyến',
        icon: <BookOpen className="w-4 h-4" />,
        href: '/wip?title=UC-50%20%E2%80%93%20T%C3%ADnh%20n%C4%83ng%20%C4%91ang%20ph%C3%A1t%20tri%E1%BB%83n&desc=Kho%20h%E1%BB%8Dc%20li%E1%BB%87u%20v%C3%A0%20kh%C3%B3a%20h%E1%BB%8Dc%20ESG'
      },
      {
        id: 'uc-51',
        label: 'Bảng giá thị trường',
        icon: <Activity className="w-4 h-4" />,
        href: '/wip?title=UC-51%20%E2%80%93%20T%C3%ADnh%20n%C4%83ng%20%C4%91ang%20ph%C3%A1t%20tri%E1%BB%83n&desc=B%E1%BA%A3ng%20gi%C3%A1%20n%C3%B4ng%20s%E1%BA%A3n%20theo%20v%C3%B9ng'
      },
      {
        id: 'uc-52',
        label: 'Gợi ý mùa vụ tối ưu',
        icon: <Sprout className="w-4 h-4" />,
        href: '/wip?title=UC-52%20%E2%80%93%20T%C3%ADnh%20n%C4%83ng%20%C4%91ang%20ph%C3%A1t%20tri%E1%BB%83n&desc=AI%20%C4%91%E1%BB%81%20xu%E1%BA%A5t%20m%C3%B9a%20v%E1%BB%A5%20ph%C3%B9%20h%E1%BB%A3p'
      },
      {
        id: 'uc-53',
        label: 'Diễn đàn cộng đồng',
        icon: <Users className="w-4 h-4" />,
        href: '/wip?title=UC-53%20%E2%80%93%20T%C3%ADnh%20n%C4%83ng%20%C4%91ang%20ph%C3%A1t%20tri%E1%BB%83n&desc=C%E1%BB%99ng%20%C4%91%E1%BB%93ng%20h%E1%BB%8Fi%20%E2%80%93%20%C4%91%C3%A1p%20c%C3%B9ng%20chuy%C3%AAn%20gia'
      }
    ]
  });

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const isExpanded = expandedGroups.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeTab === item.id;

    return (
      <div key={item.id} className="space-y-1">
        <Button
          variant={isActive ? "default" : "ghost"}
          className={cn(
            "w-full justify-start text-left h-auto p-3",
            level > 0 && "ml-4",
            isActive && "bg-agro-green text-white hover:bg-agro-dark"
          )}
          onClick={() => {
            if (hasChildren) {
              toggleGroup(item.id);
            } else if (item.href) {
              navigate(item.href);
              if (onNavigate) onNavigate();
            }
          }}
        >
          <div className="flex items-center space-x-3 w-full">
            {item.icon}
            <span className={`flex-1 ${getFontFamily('body')}`}>
              {item.label}
            </span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
            {hasChildren && (
              <div className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            )}
          </div>
        </Button>

        {hasChildren && isExpanded && (
          <div className="space-y-1 ml-2">
            {item.children?.map((child) => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto",
      className
    )}>
      <div className="p-4">
        <div className="mb-6">
          <h2 className={`text-lg font-semibold ${getFontFamily('heading')} text-gray-900 dark:text-white`}>
            AgroConnect
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dashboard
          </p>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => renderSidebarItem(item))}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;
