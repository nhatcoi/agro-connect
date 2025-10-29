import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Shield, Calendar, Camera, Upload } from 'lucide-react';

interface UserData {
  id: number;
  email: string;
  role: string;
  full_name: string;
}

interface ActivityTabProps {
  user: UserData;
}

export default function ActivityTab({ user }: ActivityTabProps) {
  const { t } = useTranslation();
  
  // Mock activity data - in real app, this would come from API
  const activities = [
    {
      id: 1,
      type: 'login',
      title: t('dashboard.activity.login'),
      description: t('dashboard.activity.loginDesc'),
      timestamp: new Date().toISOString(),
      icon: User
    },
    {
      id: 2,
      type: 'profile_update',
      title: t('dashboard.activity.profileUpdate'),
      description: t('dashboard.activity.profileUpdateDesc'),
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: User
    },
    {
      id: 3,
      type: 'esg_request',
      title: t('dashboard.activity.esgRequest'),
      description: t('dashboard.activity.esgRequestDesc'),
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      icon: Shield
    }
  ];

  // Add role-specific activities
  if (user.role === 'farmer') {
    activities.push(
      {
        id: 4,
        type: 'season_create',
        title: 'Tạo mùa vụ mới',
        description: 'Đã tạo mùa vụ "Lúa Đông Xuân 2024"',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        icon: Calendar
      },
      {
        id: 5,
        type: 'image_upload',
        title: 'Tải lên hình ảnh',
        description: 'Đã tải lên 3 hình ảnh thực địa',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        icon: Camera
      }
    );
  }

  if (user.role === 'esg_expert') {
    activities.push(
      {
        id: 4,
        type: 'esg_review',
        title: 'Duyệt yêu cầu ESG',
        description: 'Đã duyệt yêu cầu ESG của Nguyễn Văn A',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        icon: Shield
      }
    );
  }

  const getActivityTypeBadge = (type: string) => {
    switch (type) {
      case 'login':
        return <Badge variant="outline">Đăng nhập</Badge>;
      case 'profile_update':
        return <Badge className="bg-blue-500">Cập nhật hồ sơ</Badge>;
      case 'esg_request':
        return <Badge className="bg-purple-500">ESG</Badge>;
      case 'esg_review':
        return <Badge className="bg-green-500">Duyệt ESG</Badge>;
      case 'season_create':
        return <Badge className="bg-orange-500">Mùa vụ</Badge>;
      case 'image_upload':
        return <Badge className="bg-cyan-500">Hình ảnh</Badge>;
      default:
        return <Badge variant="outline">Hoạt động</Badge>;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Vừa xong';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ngày trước`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          {t('dashboard.activity.recentActivity')}
        </CardTitle>
        <CardDescription>
          {t('dashboard.activity.recentActivity')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold">{activity.title}</h3>
                      <div className="flex items-center space-x-2">
                        {getActivityTypeBadge(activity.type)}
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('dashboard.activity.noActivities')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
