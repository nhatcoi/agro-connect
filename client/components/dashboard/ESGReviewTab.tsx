import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, CheckCircle, XCircle, Clock, User, Mail, Phone } from 'lucide-react';

interface PendingESGRequest {
  id: number;
  user_id: number;
  user_email: string;
  user_full_name: string;
  user_phone?: string;
  user_role: string;
  verification_notes?: string;
  created_at: string;
}

interface ESGReviewTabProps {
  pendingRequests: PendingESGRequest[];
  onUpdateRequests: () => void;
}

export default function ESGReviewTab({ pendingRequests, onUpdateRequests }: ESGReviewTabProps) {
  const [selectedRequest, setSelectedRequest] = useState<PendingESGRequest | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    action: 'approve' as 'approve' | 'reject',
    esg_score: 85,
    verification_notes: ''
  });

  const handleReviewRequest = async () => {
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem('session_token');
      
      const response = await fetch(`/api/esg/${selectedRequest.id}/${reviewForm.action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          esg_score: reviewForm.action === 'approve' ? reviewForm.esg_score : undefined,
          verification_notes: reviewForm.verification_notes
        })
      });

      if (response.ok) {
        onUpdateRequests();
        setIsReviewModalOpen(false);
        setSelectedRequest(null);
        alert(`Đã ${reviewForm.action === 'approve' ? 'duyệt' : 'từ chối'} yêu cầu ESG thành công!`);
      } else {
        const error = await response.json();
        alert(error.message || 'Có lỗi xảy ra khi xử lý yêu cầu');
      }
    } catch (error) {
      console.error('Review ESG request error:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const openReviewModal = (request: PendingESGRequest) => {
    setSelectedRequest(request);
    setReviewForm({
      action: 'approve',
      esg_score: 85,
      verification_notes: ''
    });
    setIsReviewModalOpen(true);
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      farmer: 'Nông dân',
      business: 'Doanh nghiệp',
      esg_expert: 'Chuyên gia ESG'
    };
    return roleLabels[role] || role;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Duyệt yêu cầu xác thực ESG
          </CardTitle>
          <CardDescription>
            Xem xét và duyệt các yêu cầu xác thực ESG từ người dùng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Người yêu cầu</label>
                        <div className="flex items-center mt-1">
                          <User className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="font-semibold">{request.user_full_name}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">{request.user_email}</span>
                        </div>
                        {request.user_phone && (
                          <div className="flex items-center mt-1">
                            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">{request.user_phone}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Vai trò</label>
                        <div className="mt-1">
                          <Badge variant="outline">{getRoleLabel(request.user_role)}</Badge>
                        </div>
                        <label className="text-sm font-medium text-muted-foreground mt-2 block">Ngày yêu cầu</label>
                        <p className="text-sm">
                          {new Date(request.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex items-center justify-end">
                        <Button 
                          className="bg-agro-green hover:bg-agro-dark"
                          onClick={() => openReviewModal(request)}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Xem xét
                        </Button>
                      </div>
                    </div>
                    
                    {request.verification_notes && (
                      <div className="mb-4">
                        <label className="text-sm font-medium text-muted-foreground">Ghi chú từ người yêu cầu</label>
                        <p className="text-sm mt-1 p-3 bg-muted rounded-lg">
                          {request.verification_notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Không có yêu cầu xác thực ESG nào đang chờ duyệt</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xem xét yêu cầu xác thực ESG</DialogTitle>
            <DialogDescription>
              Duyệt hoặc từ chối yêu cầu xác thực ESG từ {selectedRequest?.user_full_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* User Info */}
            {selectedRequest && (
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Thông tin người yêu cầu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Họ tên:</span> {selectedRequest.user_full_name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {selectedRequest.user_email}
                  </div>
                  <div>
                    <span className="font-medium">Vai trò:</span> {getRoleLabel(selectedRequest.user_role)}
                  </div>
                  <div>
                    <span className="font-medium">Ngày yêu cầu:</span> {new Date(selectedRequest.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            )}

            {/* Review Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="action">Quyết định</Label>
                <Select value={reviewForm.action} onValueChange={(value: 'approve' | 'reject') => setReviewForm(prev => ({ ...prev, action: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Duyệt
                      </div>
                    </SelectItem>
                    <SelectItem value="reject">
                      <div className="flex items-center">
                        <XCircle className="w-4 h-4 mr-2 text-red-500" />
                        Từ chối
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reviewForm.action === 'approve' && (
                <div>
                  <Label htmlFor="esg_score">ESG Score (0-100)</Label>
                  <Input
                    id="esg_score"
                    type="number"
                    min="0"
                    max="100"
                    value={reviewForm.esg_score}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, esg_score: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="verification_notes">Ghi chú xác thực</Label>
                <Textarea
                  id="verification_notes"
                  value={reviewForm.verification_notes}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, verification_notes: e.target.value }))}
                  placeholder="Ghi chú về quyết định xác thực..."
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                Hủy
              </Button>
              <Button 
                className={reviewForm.action === 'approve' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
                onClick={handleReviewRequest}
              >
                {reviewForm.action === 'approve' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Duyệt
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Từ chối
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
