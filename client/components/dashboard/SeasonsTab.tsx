import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Trash2, Crop, Leaf, Award, CheckCircle } from 'lucide-react';

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

interface SeasonsTabProps {
  seasons: Season[];
  onUpdateSeasons: (updatedSeasons: Season[]) => void;
}

export default function SeasonsTab({ seasons, onUpdateSeasons }: SeasonsTabProps) {
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);
  const [seasonForm, setSeasonForm] = useState({
    season_name: '',
    crop_type: '',
    planting_date: '',
    expected_harvest_date: '',
    area_size: '',
    location_address: '',
    fertilizers: [] as string[],
    pesticides: [] as string[],
    notes: ''
  });

  const handleSeasonFormChange = (field: string, value: any) => {
    setSeasonForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateSeason = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/season', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          season_name: seasonForm.season_name,
          crop_type: seasonForm.crop_type,
          planting_date: seasonForm.planting_date,
          expected_harvest_date: seasonForm.expected_harvest_date,
          area_size: parseFloat(seasonForm.area_size),
          location_address: seasonForm.location_address,
          fertilizers: seasonForm.fertilizers,
          pesticides: seasonForm.pesticides,
          notes: seasonForm.notes
        })
      });

      if (response.ok) {
        // Reload seasons data
        const reloadResponse = await fetch('/api/season/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (reloadResponse.ok) {
          const reloadData = await reloadResponse.json();
          onUpdateSeasons(reloadData.data.seasons || []);
        }
        setIsSeasonModalOpen(false);
        alert('Tạo mùa vụ thành công!');
      } else {
        const error = await response.json();
        alert(error.message || 'Có lỗi xảy ra khi tạo mùa vụ');
      }
    } catch (error) {
      console.error('Create season error:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const handleDeleteSeason = async (seasonId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mùa vụ này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/season/${seasonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Reload seasons data
        const reloadResponse = await fetch('/api/season/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (reloadResponse.ok) {
          const reloadData = await reloadResponse.json();
          onUpdateSeasons(reloadData.data.seasons || []);
        }
        alert('Xóa mùa vụ thành công!');
      } else {
        alert('Có lỗi xảy ra khi xóa mùa vụ');
      }
    } catch (error) {
      console.error('Delete season error:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const getSeasonStatusBadge = (status: string) => {
    switch (status) {
      case 'planning':
        return <Badge variant="outline"><Calendar className="w-3 h-3 mr-1" />Lên kế hoạch</Badge>;
      case 'planting':
        return <Badge className="bg-blue-500"><Crop className="w-3 h-3 mr-1" />Gieo trồng</Badge>;
      case 'growing':
        return <Badge className="bg-green-500"><Leaf className="w-3 h-3 mr-1" />Đang phát triển</Badge>;
      case 'harvesting':
        return <Badge className="bg-yellow-500"><Award className="w-3 h-3 mr-1" />Thu hoạch</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500"><CheckCircle className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
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
                <Calendar className="w-5 h-5 mr-2" />
                Quản lý mùa vụ
              </CardTitle>
              <CardDescription>
                Ghi lại thông tin canh tác, loại cây trồng, thời gian gieo trồng
              </CardDescription>
            </div>
            <Button className="bg-agro-green hover:bg-agro-dark" onClick={() => setIsSeasonModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo mùa vụ mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {seasons.length > 0 ? (
            <div className="space-y-4">
              {seasons.map((season) => (
                <Card key={season.id} className="border-l-4 border-l-agro-green">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Tên mùa vụ</label>
                        <p className="text-lg font-semibold">{season.season_name}</p>
                        <p className="text-sm text-muted-foreground">{season.crop_type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Thời gian</label>
                        <p className="text-sm">Gieo: {new Date(season.planting_date).toLocaleDateString('vi-VN')}</p>
                        <p className="text-sm">Thu hoạch: {new Date(season.expected_harvest_date).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                        <div className="mb-2">{getSeasonStatusBadge(season.status)}</div>
                        <p className="text-sm">Diện tích: {season.area_size} ha</p>
                      </div>
                    </div>
                    
                    {season.location_address && (
                      <div className="mb-4">
                        <label className="text-sm font-medium text-muted-foreground">Địa điểm</label>
                        <p className="text-sm">{season.location_address}</p>
                      </div>
                    )}
                    
                    {(season.fertilizers.length > 0 || season.pesticides.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {season.fertilizers.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Phân bón</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {season.fertilizers.map((fertilizer, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {fertilizer}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {season.pesticides.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Thuốc BVTV</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {season.pesticides.map((pesticide, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {pesticide}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {season.notes && (
                      <div className="mb-4">
                        <label className="text-sm font-medium text-muted-foreground">Ghi chú</label>
                        <p className="text-sm">{season.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteSeason(season.id)}
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
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có mùa vụ nào</p>
              <Button className="bg-agro-green hover:bg-agro-dark" onClick={() => setIsSeasonModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo mùa vụ đầu tiên
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Season Modal */}
      <Dialog open={isSeasonModalOpen} onOpenChange={setIsSeasonModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo mùa vụ mới</DialogTitle>
            <DialogDescription>
              Ghi lại thông tin canh tác, loại cây trồng, thời gian gieo trồng
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="season_name">Tên mùa vụ</Label>
                  <Input
                    id="season_name"
                    value={seasonForm.season_name}
                    onChange={(e) => handleSeasonFormChange('season_name', e.target.value)}
                    placeholder="Ví dụ: Mùa lúa Đông Xuân 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="crop_type">Loại cây trồng</Label>
                  <Input
                    id="crop_type"
                    value={seasonForm.crop_type}
                    onChange={(e) => handleSeasonFormChange('crop_type', e.target.value)}
                    placeholder="Ví dụ: Lúa, Rau, Cà chua..."
                  />
                </div>
                <div>
                  <Label htmlFor="planting_date">Ngày gieo trồng</Label>
                  <Input
                    id="planting_date"
                    type="date"
                    value={seasonForm.planting_date}
                    onChange={(e) => handleSeasonFormChange('planting_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="expected_harvest_date">Ngày thu hoạch dự kiến</Label>
                  <Input
                    id="expected_harvest_date"
                    type="date"
                    value={seasonForm.expected_harvest_date}
                    onChange={(e) => handleSeasonFormChange('expected_harvest_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="area_size">Diện tích (ha)</Label>
                  <Input
                    id="area_size"
                    type="number"
                    step="0.1"
                    value={seasonForm.area_size}
                    onChange={(e) => handleSeasonFormChange('area_size', e.target.value)}
                    placeholder="Ví dụ: 2.5"
                  />
                </div>
                <div>
                  <Label htmlFor="location_address">Địa điểm</Label>
                  <Input
                    id="location_address"
                    value={seasonForm.location_address}
                    onChange={(e) => handleSeasonFormChange('location_address', e.target.value)}
                    placeholder="Địa chỉ ruộng/vườn"
                  />
                </div>
              </div>
            </div>

            {/* Fertilizers and Pesticides */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Phân bón và thuốc BVTV</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fertilizers">Phân bón (mỗi loại một dòng)</Label>
                  <Textarea
                    id="fertilizers"
                    value={seasonForm.fertilizers.join('\n')}
                    onChange={(e) => handleSeasonFormChange('fertilizers', e.target.value.split('\n').filter(f => f.trim()))}
                    placeholder="NPK 16-16-16&#10;Phân hữu cơ&#10;Phân chuồng"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="pesticides">Thuốc BVTV (mỗi loại một dòng)</Label>
                  <Textarea
                    id="pesticides"
                    value={seasonForm.pesticides.join('\n')}
                    onChange={(e) => handleSeasonFormChange('pesticides', e.target.value.split('\n').filter(p => p.trim()))}
                    placeholder="Thuốc trừ sâu&#10;Thuốc trừ bệnh&#10;Thuốc diệt cỏ"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ghi chú</h3>
              <div>
                <Label htmlFor="notes">Ghi chú bổ sung</Label>
                <Textarea
                  id="notes"
                  value={seasonForm.notes}
                  onChange={(e) => handleSeasonFormChange('notes', e.target.value)}
                  placeholder="Ghi chú về quy trình canh tác, điều kiện thời tiết, kết quả mong đợi..."
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsSeasonModalOpen(false)}>
                Hủy
              </Button>
              <Button className="bg-agro-green hover:bg-agro-dark" onClick={handleCreateSeason}>
                Tạo mùa vụ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
