import React, { useState, useEffect } from 'react';
import ProfileTab from '@/components/dashboard/ProfileTab';

interface UserData {
  id: number;
  email: string;
  role: string;
  full_name: string;
  is_verified: boolean;
  created_at: string;
}

interface UserProfile {
  id: number;
  user_id: number;
  bio?: string;
  location_lat?: number;
  location_lng?: number;
  address?: string;
  certifications: string[];
  activity_history: string[];
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
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

        // Load profile
        const profileResponse = await fetch('/api/profile/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData.data);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green"></div>
      </div>
    );
  }

  if (!user || !profile) {
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
    <ProfileTab 
      user={user} 
      profile={profile} 
      onUpdateProfile={handleUpdateProfile}
    />
  );
};

export default ProfilePage;
