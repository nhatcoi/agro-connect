import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SidebarInfo from '@/components/dashboard/SidebarInfo';
import { useFontFamily } from '@/hooks/useFontFamily';

const SidebarDemo: React.FC = () => {
  const { getFontFamily } = useFontFamily();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>
            <div>
              <h1 className={`text-xl font-semibold ${getFontFamily('heading')} text-gray-900 dark:text-white`}>
                Demo Sidebar Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cấu trúc và tổ chức các chức năng trong Sidebar
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SidebarInfo />
      </main>
    </div>
  );
};

export default SidebarDemo;
