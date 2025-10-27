import React, { useState, useEffect } from 'react';
import ImagesTab from '@/components/dashboard/ImagesTab';

interface Image {
  id: number;
  user_id: number;
  season_id?: number;
  image_url: string;
  image_type: 'crop' | 'field' | 'certificate' | 'diary' | 'other';
  title: string;
  description?: string;
  tags: string[];
  location_lat?: number;
  location_lng?: number;
  taken_date: string;
  created_at: string;
  updated_at: string;
}

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

const ImagesPage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Load images
        const imagesResponse = await fetch('/api/image/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          setImages(imagesData.data.images || []);
        }

        // Load seasons
        const seasonsResponse = await fetch('/api/season/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (seasonsResponse.ok) {
          const seasonsData = await seasonsResponse.json();
          setSeasons(seasonsData.data.seasons || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUpdateImages = (updatedImages: Image[]) => {
    setImages(updatedImages);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green"></div>
      </div>
    );
  }

  return (
    <ImagesTab 
      images={images}
      seasons={seasons}
      onUpdateImages={handleUpdateImages}
    />
  );
};

export default ImagesPage;
