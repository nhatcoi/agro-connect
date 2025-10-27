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
  Activity
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
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  userRole,
  className
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
          href: '/dashboard/profile'
        },
        {
          id: 'esg',
          label: 'Xác thực ESG',
          icon: <Shield className="w-4 h-4" />,
          href: '/dashboard/esg'
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
          href: '/dashboard/seasons'
        },
        {
          id: 'images',
          label: 'Hình ảnh thực địa',
          icon: <Image className="w-4 h-4" />,
          href: '/dashboard/images'
        },
        {
          id: 'products',
          label: 'Sản phẩm nông sản',
          icon: <Package className="w-4 h-4" />,
          href: '/dashboard/products'
        },
        {
          id: 'partners',
          label: 'Gợi ý đối tác',
          icon: <Users className="w-4 h-4" />,
          href: '/dashboard/partners'
        },
        {
          id: 'orders',
          label: 'Theo dõi đơn hàng',
          icon: <ShoppingCart className="w-4 h-4" />,
          href: '/dashboard/orders'
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
          id: 'partners',
          label: 'Gợi ý đối tác',
          icon: <Users className="w-4 h-4" />,
          href: '/dashboard/partners'
        },
        {
          id: 'orders',
          label: 'Theo dõi đơn hàng',
          icon: <ShoppingCart className="w-4 h-4" />,
          href: '/dashboard/orders'
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
          href: '/dashboard/review'
        }
      ]
    });
  }

  // Add activity tab for all users
  sidebarItems.push(    {
      id: 'activity',
      label: 'Hoạt động',
      icon: <Activity className="w-4 h-4" />,
      href: '/dashboard/activity'
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
