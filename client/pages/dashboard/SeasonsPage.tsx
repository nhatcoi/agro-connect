import React, { useState, useEffect } from 'react';
import SeasonsTab from '@/components/dashboard/SeasonsTab';

interface Season {
  id: number;
  user_id: number;
  season_name: string;
  crop_type: string;
  planting_date: string;
  expected_harvest_date: string;
  area_size: number;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  fertilizers: string[];
  pesticides: string[];
  notes?: string;
  status: 'planning' | 'planting' | 'growing' | 'harvesting' | 'completed';
  created_at: string;
  updated_at: string;
}

const SeasonsPage: React.FC = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeasons = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/season/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSeasons(data.data.seasons || []);
        }
      } catch (error) {
        console.error('Error loading seasons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSeasons();
  }, []);

  const handleUpdateSeasons = (updatedSeasons: Season[]) => {
    setSeasons(updatedSeasons);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green"></div>
      </div>
    );
  }

  return (
    <SeasonsTab 
      seasons={seasons} 
      onUpdateSeasons={handleUpdateSeasons}
    />
  );
};

export default SeasonsPage;
