import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  MapPin, 
  Star, 
  Award, 
  Search, 
  Filter,
  Building2,
  Phone,
  Mail,
  CheckCircle,
  TrendingUp,
  Target
} from 'lucide-react';

interface PartnerSuggestion {
  user_id: number;
  business_name: string;
  email: string;
  phone?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
  esg_score?: number;
  esg_id?: string;
  certifications: string[];
  matching_score: number;
  matching_reasons: string[];
  distance_km?: number;
  preferred_product_types: string[];
  business_description?: string;
}

interface PartnerSuggestionsTabProps {
  userRole: string;
}

export default function PartnerSuggestionsTab({ userRole }: PartnerSuggestionsTabProps) {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<PartnerSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    product_types: [] as string[],
    location_radius: 50,
    min_esg_score: 70,
    certifications: [] as string[],
    quality_standards: [] as string[],
    max_distance: 50
  });

  const productTypes = [
    'Lúa', 'Ngô', 'Khoai tây', 'Cà chua', 'Rau xanh', 'Trái cây', 
    'Cà phê', 'Tiêu', 'Điều', 'Cao su', 'Mía', 'Khác'
  ];

  const certifications = [
    'VietGAP', 'GlobalGAP', 'Hữu cơ', 'Fair Trade', 'Rainforest Alliance',
    'UTZ', '4C', 'ISO 14001', 'ISO 22000', 'HACCP'
  ];

  const qualityStandards = [
    'Grade A', 'Grade B', 'Premium', 'Standard', 'Organic',
    'Non-GMO', 'Pesticide-free', 'Chemical-free'
  ];

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('session_token');
      if (!token) return;

      const queryParams = new URLSearchParams();
      
      if (filters.product_types.length > 0) {
        filters.product_types.forEach(type => queryParams.append('product_types', type));
      }
      queryParams.append('location_radius', filters.location_radius.toString());
      queryParams.append('min_esg_score', filters.min_esg_score.toString());
      if (filters.certifications.length > 0) {
        filters.certifications.forEach(cert => queryParams.append('certifications', cert));
      }
      if (filters.quality_standards.length > 0) {
        filters.quality_standards.forEach(standard => queryParams.append('quality_standards', standard));
      }
      queryParams.append('max_distance', filters.max_distance.toString());

      const endpoint = userRole === 'farmer' ? '/api/partner/suggestions' : '/api/partner/business-suggestions';
      const response = await fetch(`${endpoint}?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        setSuggestions(result.data.suggestions || []);
      }
    } catch (error) {
      console.error('Load suggestions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'Tuyệt vời';
    if (score >= 60) return 'Tốt';
    if (score >= 40) return 'Khá';
    return 'Trung bình';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6" />
            Gợi ý đối tác
          </h2>
          <p className="text-muted-foreground mt-1">
            {userRole === 'farmer' 
              ? 'Tìm kiếm doanh nghiệp phù hợp với sản phẩm của bạn'
              : 'Tìm kiếm nông dân có sản phẩm phù hợp'
            }
          </p>
        </div>
        <Button onClick={loadSuggestions} disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Bộ lọc tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Product Types */}
            <div className="space-y-2">
              <Label>Loại sản phẩm</Label>
              <Select 
                value={filters.product_types.join(',')} 
                onValueChange={(value) => handleFilterChange('product_types', value ? value.split(',') : [])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ESG Score */}
            <div className="space-y-2">
              <Label>ESG Score tối thiểu: {filters.min_esg_score}</Label>
              <Slider
                value={[filters.min_esg_score]}
                onValueChange={(value) => handleFilterChange('min_esg_score', value[0])}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            {/* Max Distance */}
            <div className="space-y-2">
              <Label>Khoảng cách tối đa: {filters.max_distance}km</Label>
              <Slider
                value={[filters.max_distance]}
                onValueChange={(value) => handleFilterChange('max_distance', value[0])}
                max={200}
                min={10}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Certifications */}
            <div className="space-y-2">
              <Label>Chứng nhận</Label>
              <Select 
                value={filters.certifications.join(',')} 
                onValueChange={(value) => handleFilterChange('certifications', value ? value.split(',') : [])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chứng nhận" />
                </SelectTrigger>
                <SelectContent>
                  {certifications.map(cert => (
                    <SelectItem key={cert} value={cert}>
                      {cert}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quality Standards */}
            <div className="space-y-2">
              <Label>Tiêu chuẩn chất lượng</Label>
              <Select 
                value={filters.quality_standards.join(',')} 
                onValueChange={(value) => handleFilterChange('quality_standards', value ? value.split(',') : [])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tiêu chuẩn" />
                </SelectTrigger>
                <SelectContent>
                  {qualityStandards.map(standard => (
                    <SelectItem key={standard} value={standard}>
                      {standard}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tìm kiếm đối tác phù hợp...</p>
          </div>
        ) : suggestions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy đối tác phù hợp</h3>
              <p className="text-muted-foreground">
                Hãy thử điều chỉnh bộ lọc để tìm kiếm rộng hơn
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {suggestions.map((suggestion, index) => (
              <Card key={suggestion.user_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        {suggestion.business_name}
                        <Badge className={`${getScoreColor(suggestion.matching_score)} border-0`}>
                          {suggestion.matching_score}% - {getScoreBadge(suggestion.matching_score)}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {suggestion.business_description || 'Chưa có mô tả'}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      {suggestion.distance_km && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {suggestion.distance_km.toFixed(1)}km
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Thông tin liên hệ
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {suggestion.email}
                        </div>
                        {suggestion.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            {suggestion.phone}
                          </div>
                        )}
                        {suggestion.location_address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            {suggestion.location_address}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ESG & Certifications */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Chứng nhận & ESG
                      </h4>
                      <div className="space-y-2">
                        {suggestion.esg_score && (
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">ESG Score: {suggestion.esg_score}/100</span>
                            {suggestion.esg_id && (
                              <Badge variant="outline" className="text-xs">
                                {suggestion.esg_id}
                              </Badge>
                            )}
                          </div>
                        )}
                        {suggestion.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {suggestion.certifications.map((cert, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Matching Reasons */}
                  {suggestion.matching_reasons.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4" />
                          Lý do phù hợp
                        </h4>
                        <div className="space-y-1">
                          {suggestion.matching_reasons.map((reason, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              {reason}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Preferred Product Types */}
                  {suggestion.preferred_product_types.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4" />
                          Sản phẩm quan tâm
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.preferred_product_types.map((type, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Liên hệ
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Users className="w-4 h-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
