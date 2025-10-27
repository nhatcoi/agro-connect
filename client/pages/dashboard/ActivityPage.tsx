import React, { useState, useEffect } from 'react';
import ActivityTab from '@/components/dashboard/ActivityTab';

interface UserData {
  id: number;
  email: string;
  role: string;
  full_name: string;
  is_verified: boolean;
  created_at: string;
}

const ActivityPage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Không thể tải dữ liệu
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Vui lòng thử lại sau
          </p>
        </div>
      </div>
    );
  }

  return <ActivityTab user={user} />;
};

export default ActivityPage;
