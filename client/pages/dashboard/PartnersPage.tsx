import React, { useState, useEffect } from 'react';
import PartnerSuggestionsTab from '@/components/dashboard/PartnerSuggestionsTab';

const PartnersPage: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.data.role);
        }
      } catch (error) {
        console.error('Error loading user role:', error);
      }
    };

    loadUserRole();
  }, []);

  return <PartnerSuggestionsTab userRole={userRole} />;
};

export default PartnersPage;
