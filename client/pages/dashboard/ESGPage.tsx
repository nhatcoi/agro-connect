import React, { useState, useEffect } from 'react';
import ESGTab from '@/components/dashboard/ESGTab';

interface UserData {
  id: number;
  email: string;
  role: string;
  full_name: string;
  is_verified: boolean;
  created_at: string;
}

interface ESGVerification {
  id: number;
  user_id: number;
  esg_id?: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  verified_by?: number;
  verification_date?: string;
  verification_notes?: string;
  esg_score?: number;
  created_at: string;
  updated_at: string;
}

const ESGPage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [esgVerification, setEsgVerification] = useState<ESGVerification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Load user info
        const userResponse = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.data);
        }

        // Load ESG verification
        const esgResponse = await fetch('/api/esg/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (esgResponse.ok) {
          const esgData = await esgResponse.json();
          setEsgVerification(esgData.data);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green"></div>
      </div>
    );
  }

  if (!user || !esgVerification) {
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

  return (
    <ESGTab 
      user={user} 
      esgVerification={esgVerification} 
      onUpdateEsgVerification={setEsgVerification}
    />
  );
};

export default ESGPage;
