import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// Import dashboard pages
import ProfilePage from './dashboard/ProfilePage';
import ESGPage from './dashboard/ESGPage';
import ESGReviewPage from './dashboard/ESGReviewPage';
import SeasonsPage from './dashboard/SeasonsPage';
import ImagesPage from './dashboard/ImagesPage';
import ProductsPage from './dashboard/ProductsPage';
import PartnersPage from './dashboard/PartnersPage';
import OrdersPage from './dashboard/OrdersPage';
import ActivityPage from './dashboard/ActivityPage';

const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {/* Default redirect to profile */}
        <Route index element={<Navigate to="/me/profile" replace />} />
        
        {/* Dashboard pages */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="esg" element={<ESGPage />} />
        <Route path="review" element={<ESGReviewPage />} />
        <Route path="seasons" element={<SeasonsPage />} />
        <Route path="images" element={<ImagesPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="partners" element={<PartnersPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="activity" element={<ActivityPage />} />
        
        {/* Catch all - redirect to profile */}
        <Route path="*" element={<Navigate to="/me/profile" replace />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
