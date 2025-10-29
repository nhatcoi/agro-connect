import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Clock, XCircle } from 'lucide-react';

interface ESGVerification {
  id: number;
  user_id: number;
  esg_id?: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  verified_by?: number;
  verification_date?: string;
  verification_notes?: string;
  esg_score?: number;
  created_at: string;
}

interface ESGTabProps {
  esgVerification: ESGVerification | null;
}

export default function ESGTab({ esgVerification }: ESGTabProps) {
  const { t } = useTranslation();
  
  const getESGStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />{t('dashboard.esg.verified')}</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{t('dashboard.esg.rejected')}</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{t('dashboard.esg.pending')}</Badge>;
      default:
        return <Badge variant="outline">{t('dashboard.esg.notVerified')}</Badge>;
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            {t('dashboard.esg.title')}
          </CardTitle>
          <CardDescription>
            {t('dashboard.esg.status')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {esgVerification ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                  <div className="mt-2">
                    {getESGStatusBadge(esgVerification.verification_status)}
                  </div>
                </div>
                {esgVerification.esg_id && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ESG ID</label>
                    <p className="text-lg font-mono mt-1">{esgVerification.esg_id}</p>
                  </div>
                )}
                {esgVerification.esg_score && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ESG Score</label>
                    <p className="text-2xl font-bold text-agro-green mt-1">{esgVerification.esg_score}/100</p>
                  </div>
                )}
                {esgVerification.verification_date && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ngày xác thực</label>
                    <p className="text-lg mt-1">
                      {new Date(esgVerification.verification_date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                )}
              </div>
              
              {esgVerification.verification_notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ghi chú</label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-lg">
                    {esgVerification.verification_notes}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.esg.description')}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('dashboard.esg.noRequest')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
