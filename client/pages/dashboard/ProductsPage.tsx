import React, { useState, useEffect } from 'react';
import ProductsTab from '@/components/dashboard/ProductsTab';

interface Product {
  id: number;
  user_id: number;
  season_id?: number;
  product_name: string;
  product_type: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  currency: string;
  harvest_date: string;
  expiry_date?: string;
  location_address: string;
  location_lat?: number;
  location_lng?: number;
  quality_standards: string[];
  certifications: string[];
  description?: string;
  images: string[];
  status: 'available' | 'reserved' | 'sold' | 'expired';
  blockchain_hash?: string; // Added for UC-30
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

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('session_token');
        if (!token) return;

        // Load products
        const productsResponse = await fetch('/api/product/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.data.products || []);
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
        setProducts([]);
        setSeasons([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUpdateProducts = () => {
    // Reload products data
    const loadProducts = async () => {
      try {
        const token = localStorage.getItem('session_token');
        if (!token) return;

        const productsResponse = await fetch('/api/product/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.data.products || []);
        }
      } catch (error) {
        console.error('Error reloading products:', error);
      }
    };
    loadProducts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green mx-auto mb-2"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <ProductsTab
      products={products || []}
      seasons={seasons || []}
      onUpdateProducts={handleUpdateProducts}
    />
  );
};

export default ProductsPage;
