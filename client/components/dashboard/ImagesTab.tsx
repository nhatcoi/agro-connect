import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, Trash2, Calendar, Crop, MapPin, Award, Image as ImageIcon } from 'lucide-react';

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
  season_name: string;
  crop_type: string;
}

interface ImagesTabProps {
  images: Image[];
  seasons: Season[];
  onUpdateImages: (updatedImages: Image[]) => void;
}

export default function ImagesTab({ images, seasons, onUpdateImages }: ImagesTabProps) {
  const { t } = useTranslation();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageForm, setImageForm] = useState({
    season_id: '',
    image_url: '',
    image_type: 'crop' as 'crop' | 'field' | 'certificate' | 'diary' | 'other',
    title: '',
    description: '',
    tags: [] as string[],
    taken_date: ''
  });

  const handleImageFormChange = (field: string, value: any) => {
    setImageForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUploadImage = async () => {
    try {
      const token = localStorage.getItem('session_token');
      
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          season_id: imageForm.season_id && imageForm.season_id !== 'none' ? Number(imageForm.season_id) : undefined,
          image_url: imageForm.image_url,
          image_type: imageForm.image_type,
          title: imageForm.title,
          description: imageForm.description,
          tags: imageForm.tags,
          taken_date: imageForm.taken_date
        })
      });

      if (response.ok) {
        onUpdateImages(images);
        setIsImageModalOpen(false);
        alert(t('dashboard.images.uploadSuccess'));
      } else {
        const error = await response.json();
        alert(error.message || t('dashboard.images.uploadError'));
      }
    } catch (error) {
      console.error('Upload image error:', error);
      alert(t('dashboard.images.errorOccurred'));
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm(t('dashboard.images.deleteConfirm'))) {
      return;
    }

    try {
      const token = localStorage.getItem('session_token');
      
      const response = await fetch(`/api/image/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onUpdateImages(images.filter(img => img.id !== imageId));
        alert(t('dashboard.images.deleteSuccess'));
      } else {
        alert(t('dashboard.images.deleteError'));
      }
    } catch (error) {
      console.error('Delete image error:', error);
      alert(t('dashboard.images.errorOccurred'));
    }
  };

  const getImageTypeBadge = (type: string) => {
    switch (type) {
      case 'crop':
        return <Badge className="bg-green-500"><Crop className="w-3 h-3 mr-1" />{t('dashboard.images.imageTypes.crop')}</Badge>;
      case 'field':
        return <Badge className="bg-blue-500"><MapPin className="w-3 h-3 mr-1" />{t('dashboard.images.imageTypes.field')}</Badge>;
      case 'certificate':
        return <Badge className="bg-purple-500"><Award className="w-3 h-3 mr-1" />{t('dashboard.images.imageTypes.certificate')}</Badge>;
      case 'diary':
        return <Badge className="bg-orange-500"><Calendar className="w-3 h-3 mr-1" />{t('dashboard.images.imageTypes.diary')}</Badge>;
      case 'other':
        return <Badge variant="outline"><ImageIcon className="w-3 h-3 mr-1" />{t('dashboard.images.imageTypes.other')}</Badge>;
      default:
        return <Badge variant="outline">{t('dashboard.images.imageTypes.unknown')}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                {t('dashboard.images.manageImages')}
              </CardTitle>
              <CardDescription>
                {t('dashboard.images.manageImagesDesc')}
              </CardDescription>
            </div>
            <Button className="bg-agro-green hover:bg-agro-dark" onClick={() => setIsImageModalOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              {t('dashboard.images.uploadImage')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getImageTypeBadge(image.image_type)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                    {image.description && (
                      <p className="text-sm text-muted-foreground mb-3">{image.description}</p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {new Date(image.taken_date).toLocaleDateString('vi-VN')}
                      </div>
                      {image.season_id && (
                        <div className="flex items-center text-sm">
                          <Crop className="w-4 h-4 mr-2 text-muted-foreground" />
                          {t('dashboard.images.season')}: {seasons.find(s => s.id === image.season_id)?.season_name || t('dashboard.images.unknown')}
                        </div>
                      )}
                    </div>

                    {image.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {image.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {t('dashboard.images.delete')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{t('dashboard.images.noImages')}</p>
              <Button className="bg-agro-green hover:bg-agro-dark" onClick={() => setIsImageModalOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                {t('dashboard.images.uploadFirstImage')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('dashboard.images.uploadFieldImage')}</DialogTitle>
            <DialogDescription>
              {t('dashboard.images.uploadFieldImageDesc')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('dashboard.images.basicInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">{t('dashboard.images.imageUrl')}</Label>
                  <Input
                    id="image_url"
                    value={imageForm.image_url}
                    onChange={(e) => handleImageFormChange('image_url', e.target.value)}
                    placeholder={t('dashboard.images.imageUrlPlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="image_type">{t('dashboard.images.imageType')}</Label>
                  <Select value={imageForm.image_type} onValueChange={(value) => handleImageFormChange('image_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crop">{t('dashboard.images.imageTypes.crop')}</SelectItem>
                      <SelectItem value="field">{t('dashboard.images.imageTypes.field')}</SelectItem>
                      <SelectItem value="certificate">{t('dashboard.images.imageTypes.certificate')}</SelectItem>
                      <SelectItem value="diary">{t('dashboard.images.imageTypes.diary')}</SelectItem>
                      <SelectItem value="other">{t('dashboard.images.imageTypes.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">{t('dashboard.images.title')}</Label>
                  <Input
                    id="title"
                    value={imageForm.title}
                    onChange={(e) => handleImageFormChange('title', e.target.value)}
                    placeholder={t('dashboard.images.titlePlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="taken_date">{t('dashboard.images.takenDate')}</Label>
                  <Input
                    id="taken_date"
                    type="date"
                    value={imageForm.taken_date}
                    onChange={(e) => handleImageFormChange('taken_date', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="season_id">{t('dashboard.images.seasonOptional')}</Label>
                  <Select value={imageForm.season_id} onValueChange={(value) => handleImageFormChange('season_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('dashboard.images.selectSeason')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t('dashboard.images.noSeason')}</SelectItem>
                      {seasons.map((season) => (
                        <SelectItem key={season.id} value={season.id.toString()}>
                          {season.season_name} - {season.crop_type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Description and Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('dashboard.images.descriptionAndTags')}</h3>
              <div>
                <Label htmlFor="description">{t('dashboard.images.description')}</Label>
                <Textarea
                  id="description"
                  value={imageForm.description}
                  onChange={(e) => handleImageFormChange('description', e.target.value)}
                  placeholder={t('dashboard.images.descriptionPlaceholder')}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="tags">{t('dashboard.images.tags')}</Label>
                <Textarea
                  id="tags"
                  value={imageForm.tags.join('\n')}
                  onChange={(e) => handleImageFormChange('tags', e.target.value.split('\n').filter(t => t.trim()))}
                  placeholder={t('dashboard.images.tagsPlaceholder')}
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsImageModalOpen(false)}>
                {t('dashboard.images.cancel')}
              </Button>
              <Button className="bg-agro-green hover:bg-agro-dark" onClick={handleUploadImage}>
                <Upload className="w-4 h-4 mr-2" />
                {t('dashboard.images.upload')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
