import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Building
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFontFamily } from '@/hooks/useFontFamily';

interface Order {
  id: number;
  order_number: string;
  farmer_id: number;
  business_id: number;
  product_id: number;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_amount: number;
  currency: string;
  status: 'pending' | 'negotiating' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  delivery_address: string;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_date?: string;
  notes?: string;
  contract_url?: string;
  qr_code?: string;
  blockchain_hash?: string;
  created_at: string;
  updated_at: string;
}

interface OrderStats {
  total: number;
  pending: number;
  negotiating: number;
  confirmed: number;
  in_progress: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  completed: number;
}

const OrdersTab: React.FC = () => {
  const { t } = useTranslation();
  const { getFontFamily } = useFontFamily();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 1,
        order_number: 'ORD-1703123456-ABC123',
        farmer_id: 1,
        business_id: 14,
        product_id: 1,
        quantity: 100,
        unit: 'kg',
        price_per_unit: 15000,
        total_amount: 1500000,
        currency: 'VND',
        status: 'pending',
        delivery_address: '123 Đường ABC, Quận 1, TP.HCM',
        delivery_date: '2024-01-15',
        notes: 'Giao hàng vào buổi sáng',
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z'
      },
      {
        id: 2,
        order_number: 'ORD-1703123457-DEF456',
        farmer_id: 1,
        business_id: 14,
        product_id: 2,
        quantity: 50,
        unit: 'kg',
        price_per_unit: 20000,
        total_amount: 1000000,
        currency: 'VND',
        status: 'confirmed',
        delivery_address: '456 Đường XYZ, Quận 2, TP.HCM',
        delivery_date: '2024-01-20',
        notes: 'Sản phẩm hữu cơ',
        created_at: '2024-01-12T14:30:00Z',
        updated_at: '2024-01-13T09:15:00Z'
      }
    ];

    const mockStats: OrderStats = {
      total: 2,
      pending: 1,
      negotiating: 0,
      confirmed: 1,
      in_progress: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      completed: 0
    };

    setOrders(mockOrders);
    setStats(mockStats);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'negotiating': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'negotiating': return <AlertCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <TrendingUp className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Package className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
      case 'cancelled': return 'Đã hủy';
      case 'completed': return 'Hoàn thành';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.delivery_address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency === 'VND' ? 'VND' : 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${getFontFamily('heading')}`}>
            Quản lý đơn hàng
          </h2>
          <p className="text-muted-foreground">
            Theo dõi và quản lý các đơn hàng đang đàm phán hoặc giao dịch
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-agro-green hover:bg-agro-dark">
              <Plus className="w-4 h-4 mr-2" />
              Tạo đơn hàng mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo đơn hàng mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chức năng tạo đơn hàng sẽ được triển khai trong phiên bản tiếp theo</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Tổng cộng</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">Chờ xử lý</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Đang đàm phán</p>
                  <p className="text-2xl font-bold">{stats.negotiating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Đã xác nhận</p>
                  <p className="text-2xl font-bold">{stats.confirmed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Đang xử lý</p>
                  <p className="text-2xl font-bold">{stats.in_progress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium">Đã giao hàng</p>
                  <p className="text-2xl font-bold">{stats.shipped}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium">Đã nhận hàng</p>
                  <p className="text-2xl font-bold">{stats.delivered}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">Đã hủy</p>
                  <p className="text-2xl font-bold">{stats.cancelled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Tìm theo mã đơn hàng, địa chỉ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="negotiating">Đang đàm phán</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="in_progress">Đang xử lý</SelectItem>
                  <SelectItem value="shipped">Đã giao hàng</SelectItem>
                  <SelectItem value="delivered">Đã nhận hàng</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Không có đơn hàng</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Không tìm thấy đơn hàng phù hợp với bộ lọc'
                  : 'Bạn chưa có đơn hàng nào. Hãy tạo đơn hàng đầu tiên!'
                }
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo đơn hàng mới
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold">{order.order_number}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span>{getStatusText(order.status)}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{formatCurrency(order.total_amount, order.currency)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span>{order.quantity} {order.unit}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{order.delivery_address}</span>
                    </div>

                    {order.delivery_date && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Giao hàng: {formatDate(order.delivery_date)}
                        </span>
                      </div>
                    )}

                    {order.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          <strong>Ghi chú:</strong> {order.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Mã đơn hàng</Label>
                                <p className="font-medium">{selectedOrder.order_number}</p>
                              </div>
                              <div>
                                <Label>Trạng thái</Label>
                                <Badge className={getStatusColor(selectedOrder.status)}>
                                  {getStatusText(selectedOrder.status)}
                                </Badge>
                              </div>
                              <div>
                                <Label>Tổng tiền</Label>
                                <p className="font-medium">{formatCurrency(selectedOrder.total_amount, selectedOrder.currency)}</p>
                              </div>
                              <div>
                                <Label>Số lượng</Label>
                                <p className="font-medium">{selectedOrder.quantity} {selectedOrder.unit}</p>
                              </div>
                              <div>
                                <Label>Địa chỉ giao hàng</Label>
                                <p className="text-sm">{selectedOrder.delivery_address}</p>
                              </div>
                              <div>
                                <Label>Ngày tạo</Label>
                                <p className="text-sm">{formatDate(selectedOrder.created_at)}</p>
                              </div>
                            </div>
                            {selectedOrder.notes && (
                              <div>
                                <Label>Ghi chú</Label>
                                <p className="text-sm">{selectedOrder.notes}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
