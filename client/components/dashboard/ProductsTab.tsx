import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, Trash2, Calendar, MapPin, Award, DollarSign, Scale, QrCode } from 'lucide-react';
import QRGenerator from '@/components/QRGenerator';

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
  season_name: string;
  crop_type: string;
}

interface ProductsTabProps {
  products: Product[];
  seasons: Season[];
  onUpdateProducts: () => void;
}

export default function ProductsTab({ products, seasons, onUpdateProducts }: ProductsTabProps) {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    season_id: '',
    product_name: '',
    product_type: '',
    quantity: '',
    unit: 'kg',
    price_per_unit: '',
    currency: 'VND',
    harvest_date: '',
    expiry_date: '',
    location_address: '',
    quality_standards: [] as string[],
    certifications: [] as string[],
    description: '',
    images: [] as string[],
    status: 'available' as 'available' | 'reserved' | 'sold' | 'expired'
  });

  const handleProductFormChange = (field: string, value: any) => {
    setProductForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateProduct = async () => {
    try {
      const token = localStorage.getItem('session_token');
      
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          season_id: productForm.season_id && productForm.season_id !== 'none' ? Number(productForm.season_id) : undefined,
          product_name: productForm.product_name,
          product_type: productForm.product_type,
          quantity: Number(productForm.quantity),
          unit: productForm.unit,
          price_per_unit: Number(productForm.price_per_unit),
          currency: productForm.currency,
          harvest_date: productForm.harvest_date,
          expiry_date: productForm.expiry_date || undefined,
          location_address: productForm.location_address,
          quality_standards: productForm.quality_standards,
          certifications: productForm.certifications,
          description: productForm.description,
          images: productForm.images,
          status: productForm.status
        })
      });

      if (response.ok) {
        onUpdateProducts();
        setIsProductModalOpen(false);
        alert('Tạo sản phẩm thành công!');
      } else {
        const error = await response.json();
        alert(error.message || 'Có lỗi xảy ra khi tạo sản phẩm');
      }
    } catch (error) {
      console.error('Create product error:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('session_token');
      
      const response = await fetch(`/api/product/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onUpdateProducts();
        alert('Xóa sản phẩm thành công!');
      } else {
        alert('Có lỗi xảy ra khi xóa sản phẩm');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const getProductStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Có sẵn</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-500">Đã đặt</Badge>;
      case 'sold':
        return <Badge className="bg-blue-500">Đã bán</Badge>;
      case 'expired':
        return <Badge variant="destructive">Hết hạn</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    }
    return `${price} ${currency}`;
  };

  const handleGenerateQR = async (product: Product) => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.id
        })
      });

      const result = await response.json();
      if (result.success) {
        setQrData(result.data);
        setSelectedProduct({
          ...product,
          blockchain_hash: result.data.blockchain_hash
        });
        setIsQRModalOpen(true);
      } else {
        console.error('Generate QR error:', result.message);
      }
    } catch (error) {
      console.error('Generate QR error:', error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Quản lý sản phẩm nông sản
              </CardTitle>
              <CardDescription>
                Khai báo tên, khối lượng, vùng trồng, tiêu chuẩn chất lượng
              </CardDescription>
            </div>
            <Button className="bg-agro-green hover:bg-agro-dark" onClick={() => setIsProductModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo sản phẩm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {products && products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="border-l-4 border-l-agro-green">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Tên sản phẩm</label>
                        <p className="text-lg font-semibold">{product.product_name}</p>
                        <p className="text-sm text-muted-foreground">{product.product_type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Số lượng & Giá</label>
                        <p className="text-sm">{product.quantity} {product.unit}</p>
                        <p className="text-lg font-bold text-agro-green">
                          {formatPrice(product.price_per_unit, product.currency)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                        <div className="mb-2">{getProductStatusBadge(product.status)}</div>
                        <p className="text-sm">Thu hoạch: {new Date(product.harvest_date).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleGenerateQR(product)}
                        >
                          <QrCode className="w-4 h-4 mr-1" />
                          QR Code
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="text-sm font-medium text-muted-foreground">Địa điểm</label>
                      <p className="text-sm">{product.location_address}</p>
                    </div>
                    
                    {(product.quality_standards.length > 0 || product.certifications.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {product.quality_standards.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Tiêu chuẩn chất lượng</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.quality_standards.map((standard, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Award className="w-3 h-3 mr-1" />
                                  {standard}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {product.certifications.length > 0 && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Chứng nhận</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.certifications.map((cert, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Award className="w-3 h-3 mr-1" />
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {product.description && (
                      <div className="mb-4">
                        <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
                        <p className="text-sm">{product.description}</p>
                      </div>
                    )}

                    {product.season_id && (
                      <div className="mb-4">
                        <label className="text-sm font-medium text-muted-foreground">Mùa vụ</label>
                        <p className="text-sm">
                          {seasons && seasons.find(s => s.id === product.season_id)?.season_name || 'Không xác định'}
                        </p>
                      </div>
                    )}

                    {product.expiry_date && (
                      <div className="mb-4">
                        <label className="text-sm font-medium text-muted-foreground">Hạn sử dụng</label>
                        <p className="text-sm">{new Date(product.expiry_date).toLocaleDateString('vi-VN')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có sản phẩm nào</p>
              <Button className="bg-agro-green hover:bg-agro-dark" onClick={() => setIsProductModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo sản phẩm đầu tiên
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo sản phẩm nông sản</DialogTitle>
            <DialogDescription>
              Khai báo tên, khối lượng, vùng trồng, tiêu chuẩn chất lượng
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product_name">Tên sản phẩm</Label>
                  <Input
                    id="product_name"
                    value={productForm.product_name}
                    onChange={(e) => handleProductFormChange('product_name', e.target.value)}
                    placeholder="Ví dụ: Lúa Jasmine"
                  />
                </div>
                <div>
                  <Label htmlFor="product_type">Loại sản phẩm</Label>
                  <Input
                    id="product_type"
                    value={productForm.product_type}
                    onChange={(e) => handleProductFormChange('product_type', e.target.value)}
                    placeholder="Ví dụ: Gạo, Rau, Trái cây..."
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Số lượng</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={productForm.quantity}
                    onChange={(e) => handleProductFormChange('quantity', e.target.value)}
                    placeholder="Ví dụ: 100"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Đơn vị</Label>
                  <Select value={productForm.unit} onValueChange={(value) => handleProductFormChange('unit', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="tấn">Tấn</SelectItem>
                      <SelectItem value="bao">Bao</SelectItem>
                      <SelectItem value="thùng">Thùng</SelectItem>
                      <SelectItem value="cái">Cái</SelectItem>
                      <SelectItem value="chùm">Chùm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price_per_unit">Giá mỗi đơn vị</Label>
                  <Input
                    id="price_per_unit"
                    type="number"
                    value={productForm.price_per_unit}
                    onChange={(e) => handleProductFormChange('price_per_unit', e.target.value)}
                    placeholder="Ví dụ: 25000"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Tiền tệ</Label>
                  <Select value={productForm.currency} onValueChange={(value) => handleProductFormChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">VND</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="harvest_date">Ngày thu hoạch</Label>
                  <Input
                    id="harvest_date"
                    type="date"
                    value={productForm.harvest_date}
                    onChange={(e) => handleProductFormChange('harvest_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry_date">Hạn sử dụng (tùy chọn)</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={productForm.expiry_date}
                    onChange={(e) => handleProductFormChange('expiry_date', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="location_address">Địa chỉ vùng trồng</Label>
                  <Input
                    id="location_address"
                    value={productForm.location_address}
                    onChange={(e) => handleProductFormChange('location_address', e.target.value)}
                    placeholder="Địa chỉ chi tiết vùng trồng"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="season_id">Mùa vụ (tùy chọn)</Label>
                  <Select value={productForm.season_id} onValueChange={(value) => handleProductFormChange('season_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mùa vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không chọn mùa vụ</SelectItem>
                      {seasons && seasons.map((season) => (
                        <SelectItem key={season.id} value={season.id.toString()}>
                          {season.season_name} - {season.crop_type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Quality Standards and Certifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tiêu chuẩn chất lượng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quality_standards">Tiêu chuẩn chất lượng (mỗi tiêu chuẩn một dòng)</Label>
                  <Textarea
                    id="quality_standards"
                    value={productForm.quality_standards.join('\n')}
                    onChange={(e) => handleProductFormChange('quality_standards', e.target.value.split('\n').filter(q => q.trim()))}
                    placeholder="VietGAP&#10;Hữu cơ&#10;GlobalGAP"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="certifications">Chứng nhận (mỗi chứng nhận một dòng)</Label>
                  <Textarea
                    id="certifications"
                    value={productForm.certifications.join('\n')}
                    onChange={(e) => handleProductFormChange('certifications', e.target.value.split('\n').filter(c => c.trim()))}
                    placeholder="Chứng nhận hữu cơ&#10;Chứng nhận GAP&#10;Chứng nhận ISO"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Mô tả</h3>
              <div>
                <Label htmlFor="description">Mô tả sản phẩm</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => handleProductFormChange('description', e.target.value)}
                  placeholder="Mô tả chi tiết về sản phẩm, đặc điểm, cách bảo quản..."
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>
                Hủy
              </Button>
              <Button className="bg-agro-green hover:bg-agro-dark" onClick={handleCreateProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo sản phẩm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

          {/* QR Generator Modal */}
          {selectedProduct && (
            <QRGenerator
              isOpen={isQRModalOpen}
              onClose={() => {
                setIsQRModalOpen(false);
                setSelectedProduct(null);
                setQrData(null);
              }}
              productId={selectedProduct.id}
              productName={selectedProduct.product_name}
              blockchainHash={selectedProduct.blockchain_hash}
              blockchainTxHash={qrData?.blockchain_tx_hash}
              blockchainAvailable={qrData?.blockchain_available}
            />
          )}
    </>
  );
}
