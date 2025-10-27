import React, { useState } from 'react';
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
        onUpdateImages();
        setIsImageModalOpen(false);
        alert('Tải lên hình ảnh thành công!');
      } else {
        const error = await response.json();
        alert(error.message || 'Có lỗi xảy ra khi tải lên hình ảnh');
      }
    } catch (error) {
      console.error('Upload image error:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
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
        onUpdateImages();
        alert('Xóa hình ảnh thành công!');
      } else {
        alert('Có lỗi xảy ra khi xóa hình ảnh');
      }
    } catch (error) {
      console.error('Delete image error:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const getImageTypeBadge = (type: string) => {
    switch (type) {
      case 'crop':
        return <Badge className="bg-green-500"><Crop className="w-3 h-3 mr-1" />Nông sản</Badge>;
      case 'field':
        return <Badge className="bg-blue-500"><MapPin className="w-3 h-3 mr-1" />Ruộng vườn</Badge>;
      case 'certificate':
        return <Badge className="bg-purple-500"><Award className="w-3 h-3 mr-1" />Chứng nhận</Badge>;
      case 'diary':
        return <Badge className="bg-orange-500"><Calendar className="w-3 h-3 mr-1" />Nhật ký</Badge>;
      case 'other':
        return <Badge variant="outline"><ImageIcon className="w-3 h-3 mr-1" />Khác</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
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
                Quản lý hình ảnh thực địa
              </CardTitle>
              <CardDescription>
                Tải lên ảnh nông sản, nhật ký canh tác, chứng nhận
              </CardDescription>
            </div>
            <Button className="bg-agro-green hover:bg-agro-dark" onClick={() => setIsImageModalOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Tải lên hình ảnh
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
                          Mùa vụ: {seasons.find(s => s.id === image.season_id)?.season_name || 'Không xác định'}
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
                        Xóa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có hình ảnh nào</p>
              <Button className="bg-agro-green hover:bg-agro-dark" onClick={() => setIsImageModalOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Tải lên hình ảnh đầu tiên
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tải lên hình ảnh thực địa</DialogTitle>
            <DialogDescription>
              Tải lên ảnh nông sản, nhật ký canh tác, chứng nhận
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">URL hình ảnh</Label>
                  <Input
                    id="image_url"
                    value={imageForm.image_url}
                    onChange={(e) => handleImageFormChange('image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="image_type">Loại hình ảnh</Label>
                  <Select value={imageForm.image_type} onValueChange={(value) => handleImageFormChange('image_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crop">Nông sản</SelectItem>
                      <SelectItem value="field">Ruộng vườn</SelectItem>
                      <SelectItem value="certificate">Chứng nhận</SelectItem>
                      <SelectItem value="diary">Nhật ký canh tác</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    value={imageForm.title}
                    onChange={(e) => handleImageFormChange('title', e.target.value)}
                    placeholder="Ví dụ: Lúa đang phát triển"
                  />
                </div>
                <div>
                  <Label htmlFor="taken_date">Ngày chụp</Label>
                  <Input
                    id="taken_date"
                    type="date"
                    value={imageForm.taken_date}
                    onChange={(e) => handleImageFormChange('taken_date', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="season_id">Mùa vụ (tùy chọn)</Label>
                  <Select value={imageForm.season_id} onValueChange={(value) => handleImageFormChange('season_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mùa vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không chọn mùa vụ</SelectItem>
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
              <h3 className="text-lg font-semibold">Mô tả và thẻ</h3>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={imageForm.description}
                  onChange={(e) => handleImageFormChange('description', e.target.value)}
                  placeholder="Mô tả chi tiết về hình ảnh..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="tags">Thẻ (mỗi thẻ một dòng)</Label>
                <Textarea
                  id="tags"
                  value={imageForm.tags.join('\n')}
                  onChange={(e) => handleImageFormChange('tags', e.target.value.split('\n').filter(t => t.trim()))}
                  placeholder="lúa&#10;đẻ nhánh&#10;khỏe mạnh"
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsImageModalOpen(false)}>
                Hủy
              </Button>
              <Button className="bg-agro-green hover:bg-agro-dark" onClick={handleUploadImage}>
                <Upload className="w-4 h-4 mr-2" />
                Tải lên
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
