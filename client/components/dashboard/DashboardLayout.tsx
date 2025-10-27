import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useFontFamily } from '@/hooks/useFontFamily';
import { LogOut, Menu, X } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';

interface UserData {
  id: number;
  email: string;
  role: string;
  full_name: string;
  is_verified: boolean;
  created_at: string;
}

const DashboardLayout: React.FC = () => {
  const { getFontFamily } = useFontFamily();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }

        const userResponse = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.data);
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case '/dashboard/profile': return 'Hồ sơ cá nhân';
      case '/dashboard/esg': return 'Xác thực ESG';
      case '/dashboard/review': return 'Duyệt ESG';
      case '/dashboard/seasons': return 'Mùa vụ';
      case '/dashboard/images': return 'Hình ảnh thực địa';
      case '/dashboard/products': return 'Sản phẩm nông sản';
      case '/dashboard/partners': return 'Gợi ý đối tác';
      case '/dashboard/orders': return 'Theo dõi đơn hàng';
      case '/dashboard/activity': return 'Hoạt động';
      default: return 'Dashboard';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <DashboardSidebar
          activeTab={location.pathname.split('/')[2] || 'profile'}
          onTabChange={(tab) => {
            navigate(`/dashboard/${tab}`);
            setSidebarOpen(false);
          }}
          userRole={user.role}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div>
                <h1 className={`text-xl font-semibold ${getFontFamily('heading')} text-gray-900 dark:text-white`}>
                  {getPageTitle(location.pathname)}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Chào mừng trở lại, {user.full_name}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
