import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, MapPin, Award, Edit, Settings } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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
  const { t } = useTranslation();
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
        onUpdateProfile(profile!);
        setIsEditModalOpen(false);
        alert(t('dashboard.profile.updateSuccess'));
      } else {
        alert(t('dashboard.profile.updateError'));
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert(t('dashboard.profile.errorOccurred'));
    }
  };

  const getRoleLabel = (role: string) => {
    return t(`dashboard.profile.roles.${role}`) || role;
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
                {t('dashboard.profile.personalInfo')}
              </CardTitle>
              <CardDescription>
                {t('dashboard.profile.personalInfoDesc')}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              {t('dashboard.profile.editInfo')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('dashboard.profile.fullName')}</label>
                <p className="text-lg font-semibold">{user.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('dashboard.profile.email')}</label>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('dashboard.profile.phone')}</label>
                <p className="text-lg">{user.phone || t('dashboard.profile.notUpdated')}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('dashboard.profile.role')}</label>
                <div className="mt-1">
                  <Badge className="bg-agro-green text-white">
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('dashboard.profile.accountStatus')}</label>
                <div className="mt-1">
                  <Badge variant="outline">{t('dashboard.profile.active')}</Badge>
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
              {t('dashboard.profile.additionalInfo')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.profile.additionalInfoDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.bio && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('dashboard.profile.bio')}</label>
                  <p className="text-sm mt-1">{profile.bio}</p>
                </div>
              )}
              {profile.address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('dashboard.profile.address')}</label>
                  <p className="text-sm mt-1">{profile.address}</p>
                </div>
              )}
              {profile.certifications && profile.certifications.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('dashboard.profile.certifications')}</label>
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
                  <label className="text-sm font-medium text-muted-foreground">{t('dashboard.profile.socialLinks')}</label>
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

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            {t('dashboard.settings')}
          </CardTitle>
          <CardDescription>
            {t('dashboard.settingsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('dashboard.theme')}</label>
                <div className="mt-2">
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('dashboard.language')}</label>
                <div className="mt-2">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('dashboard.profile.editPersonalInfo')}</DialogTitle>
            <DialogDescription>
              {t('dashboard.profile.editPersonalInfoDesc')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('dashboard.profile.basicInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">{t('dashboard.profile.fullName')}</Label>
                  <Input
                    id="full_name"
                    value={editForm.full_name}
                    onChange={(e) => handleEditFormChange('full_name', e.target.value)}
                    placeholder={t('dashboard.profile.enterFullName')}
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('dashboard.profile.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleEditFormChange('email', e.target.value)}
                    placeholder={t('dashboard.profile.enterEmail')}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t('dashboard.profile.phone')}</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => handleEditFormChange('phone', e.target.value)}
                    placeholder={t('dashboard.profile.enterPhone')}
                  />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('dashboard.profile.additionalInfo')}</h3>
              <div>
                <Label htmlFor="bio">{t('dashboard.profile.bio')}</Label>
                <Textarea
                  id="bio"
                  value={editForm.bio}
                  onChange={(e) => handleEditFormChange('bio', e.target.value)}
                  placeholder={t('dashboard.profile.bioPlaceholder')}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="address">{t('dashboard.profile.address')}</Label>
                <Input
                  id="address"
                  value={editForm.address}
                  onChange={(e) => handleEditFormChange('address', e.target.value)}
                  placeholder={t('dashboard.profile.enterAddress')}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('dashboard.profile.socialLinks')}</h3>
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
                {t('dashboard.profile.cancel')}
              </Button>
              <Button className="bg-agro-green hover:bg-agro-dark" onClick={handleSaveProfile}>
                {t('dashboard.profile.saveChanges')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
