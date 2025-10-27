import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, MapPin, Award, Edit } from 'lucide-react';

interface UserData {
  id: number;
  email: string;
  role: string;
  full_name: string;
  phone?: string;
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

interface ProfileTabProps {
  user: UserData;
  profile: UserProfile | null;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

export default function ProfileTab({ user, profile, onUpdateProfile }: ProfileTabProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: user.full_name,
    email: user.email,
    phone: user.phone || '',
    bio: profile?.bio || '',
    address: profile?.address || '',
    certifications: profile?.certifications || [],
    social_links: profile?.social_links || {}
  });

  const handleEditFormChange = (field: string, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('session_token');
      
      // Update user info
      const userResponse = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: editForm.full_name,
          email: editForm.email,
          phone: editForm.phone
        })
      });

      // Update profile
      const profileResponse = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bio: editForm.bio,
          address: editForm.address,
          certifications: editForm.certifications,
          social_links: editForm.social_links
        })
      });

      if (userResponse.ok && profileResponse.ok) {
        onUpdateProfile();
        setIsEditModalOpen(false);
        alert('Cập nhật thông tin thành công!');
      } else {
        alert('Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      farmer: 'Nông dân',
      business: 'Doanh nghiệp',
      consumer: 'Người tiêu dùng',
      esg_expert: 'Chuyên gia ESG'
    };
    return roleLabels[role] || role;
  };

  return (
    <div className="grid gap-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>
                Thông tin cơ bản và vai trò của bạn
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa thông tin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Họ và tên</label>
                <p className="text-lg font-semibold">{user.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Số điện thoại</label>
                <p className="text-lg">{user.phone || 'Chưa cập nhật'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Vai trò</label>
                <div className="mt-1">
                  <Badge className="bg-agro-green text-white">
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Trạng thái tài khoản</label>
                <div className="mt-1">
                  <Badge variant="outline">Hoạt động</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details Card */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Thông tin bổ sung
            </CardTitle>
            <CardDescription>
              Thông tin chi tiết về hồ sơ của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.bio && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Giới thiệu</label>
                  <p className="text-sm mt-1">{profile.bio}</p>
                </div>
              )}
              {profile.address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Địa chỉ</label>
                  <p className="text-sm mt-1">{profile.address}</p>
                </div>
              )}
              {profile.certifications && profile.certifications.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Chứng chỉ</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline">
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Liên kết mạng xã hội</label>
                  <div className="space-y-1 mt-1">
                    {Object.entries(profile.social_links).map(([platform, url]) => (
                      <div key={platform} className="text-sm">
                        <span className="font-medium capitalize">{platform}:</span> {url}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cá nhân và hồ sơ của bạn
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Họ và tên</Label>
                  <Input
                    id="full_name"
                    value={editForm.full_name}
                    onChange={(e) => handleEditFormChange('full_name', e.target.value)}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleEditFormChange('email', e.target.value)}
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => handleEditFormChange('phone', e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin bổ sung</h3>
              <div>
                <Label htmlFor="bio">Giới thiệu</Label>
                <Textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) => handleEditFormChange('bio', e.target.value)}
                  placeholder="Giới thiệu về bản thân..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={editForm.address}
                  onChange={(e) => handleEditFormChange('address', e.target.value)}
                  placeholder="Nhập địa chỉ"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Liên kết mạng xã hội</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={editForm.social_links.facebook || ''}
                    onChange={(e) => handleEditFormChange('social_links', {
                      ...editForm.social_links,
                      facebook: e.target.value
                    })}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={editForm.social_links.linkedin || ''}
                    onChange={(e) => handleEditFormChange('social_links', {
                      ...editForm.social_links,
                      linkedin: e.target.value
                    })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={editForm.social_links.twitter || ''}
                    onChange={(e) => handleEditFormChange('social_links', {
                      ...editForm.social_links,
                      twitter: e.target.value
                    })}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={editForm.social_links.website || ''}
                    onChange={(e) => handleEditFormChange('social_links', {
                      ...editForm.social_links,
                      website: e.target.value
                    })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Hủy
              </Button>
              <Button className="bg-agro-green hover:bg-agro-dark" onClick={handleSaveProfile}>
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
