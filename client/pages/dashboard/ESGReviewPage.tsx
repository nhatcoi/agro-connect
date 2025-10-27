import React, { useState, useEffect } from 'react';
import ESGReviewTab from '@/components/dashboard/ESGReviewTab';

interface PendingESGRequest {
  id: number;
  user_id: number;
  user_email: string;
  user_full_name: string;
  user_phone?: string;
  user_role: string;
  verification_notes?: string;
  created_at: string;
}

const ESGReviewPage: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<PendingESGRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPendingRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/esg/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setPendingRequests(data.data || []);
        }
      } catch (error) {
        console.error('Error loading pending requests:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPendingRequests();
  }, []);

  const handleUpdateRequests = () => {
    // Reload pending requests
    const loadPendingRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/esg/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setPendingRequests(data.data || []);
        }
      } catch (error) {
        console.error('Error loading pending requests:', error);
      }
    };

    loadPendingRequests();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green"></div>
      </div>
    );
  }

  return (
    <ESGReviewTab 
      pendingRequests={pendingRequests}
      onUpdateRequests={handleUpdateRequests}
    />
  );
};

export default ESGReviewPage;
