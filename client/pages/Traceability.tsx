import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Calendar, 
  User, 
  Package, 
  Shield,
  QrCode,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFontFamily } from '@/hooks/useFontFamily';

interface TraceabilityData {
  product: {
    id: number;
    name: string;
    type: string;
    quantity: number;
    unit: string;
    harvest_date: string;
    location: string;
    quality_standards: string[];
    certifications: string[];
    blockchain_hash: string;
    created_at: string;
  };
  farmer: {
    id: number;
    name: string;
    email: string;
  } | null;
  orders: Array<{
    id: number;
    order_number: string;
    business_id: number;
    quantity: number;
    status: string;
    created_at: string;
  }>;
  blockchain_verification: {
    is_verified: boolean;
    expected_hash: string;
    actual_hash: string;
    verification_date: string;
  };
}

export default function Traceability() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getFontFamily } = useFontFamily();
  const [data, setData] = useState<TraceabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (productId) {
      fetchTraceabilityData();
    }
  }, [productId]);

  const fetchTraceabilityData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/qr/traceability/${productId}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || 'Không thể tải thông tin truy xuất');
      }
    } catch (err) {
      console.error('Fetch traceability error:', err);
      setError('Lỗi khi tải thông tin truy xuất');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'shipped':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
      case 'negotiating':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'negotiating': return 'Đang đàm phán';
      case 'confirmed': return 'Đã xác nhận';
      case 'in_progress': return 'Đang xử lý';
      case 'shipped': return 'Đã giao hàng';
      case 'delivered': return 'Đã nhận hàng';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agro-green mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải thông tin truy xuất...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/me')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại</span>
              </Button>
              <div>
                <h1 className={`text-2xl font-bold ${getFontFamily('heading')}`}>
                  Truy xuất nguồn gốc sản phẩm
                </h1>
                <p className="text-muted-foreground">
                  Thông tin chi tiết về sản phẩm {data.product.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={data.blockchain_verification.is_verified ? "default" : "destructive"}
                className="flex items-center space-x-1"
              >
                {data.blockchain_verification.is_verified ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                <span>
                  {data.blockchain_verification.is_verified ? 'Đã xác thực' : 'Chưa xác thực'}
                </span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Thông tin sản phẩm</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{data.product.name}</h3>
                <p className="text-muted-foreground">{data.product.type}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-agro-green">
                  {data.product.quantity} {data.product.unit}
                </p>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Ngày thu hoạch:</span>
                  <span>{new Date(data.product.harvest_date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Địa điểm:</span>
                  <span>{data.product.location}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <QrCode className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Blockchain Hash:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {data.product.blockchain_hash.substring(0, 16)}...
                  </code>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Tạo lúc:</span>
                  <span>{new Date(data.product.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>

            {/* Quality Standards */}
            {data.product.quality_standards.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Tiêu chuẩn chất lượng</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.product.quality_standards.map((standard, index) => (
                    <Badge key={index} variant="secondary">
                      {standard}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {data.product.certifications.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Chứng nhận</h4>
                <div className="flex flex-wrap gap-2">
                  {data.product.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Farmer Information */}
        {data.farmer && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Thông tin nông dân</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{data.farmer.name}</h3>
                  <p className="text-muted-foreground">{data.farmer.email}</p>
                </div>
                <div className="text-right">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Xem hồ sơ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blockchain Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Xác thực Blockchain</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Trạng thái xác thực:</span>
                <Badge 
                  variant={data.blockchain_verification.is_verified ? "default" : "destructive"}
                  className="flex items-center space-x-1"
                >
                  {data.blockchain_verification.is_verified ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  <span>
                    {data.blockchain_verification.is_verified ? 'Đã xác thực' : 'Chưa xác thực'}
                  </span>
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Hash mong đợi:</span>
                  <code className="block text-xs bg-muted p-2 rounded mt-1 break-all">
                    {data.blockchain_verification.expected_hash}
                  </code>
                </div>
                <div>
                  <span className="font-medium">Hash thực tế:</span>
                  <code className="block text-xs bg-muted p-2 rounded mt-1 break-all">
                    {data.blockchain_verification.actual_hash}
                  </code>
                </div>
                <div>
                  <span className="font-medium">Thời gian xác thực:</span>
                  <span className="ml-2">
                    {new Date(data.blockchain_verification.verification_date).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders History */}
        {data.orders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Đơn hàng #{order.order_number}</h4>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Số lượng:</span> {order.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Ngày tạo:</span> {new Date(order.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
