import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFontFamily } from '@/hooks/useFontFamily';
import { Eye, EyeOff, User, Mail, Phone, Lock, MapPin } from 'lucide-react';

interface AuthFormData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  role: 'farmer' | 'business' | 'consumer' | 'esg_expert';
}

export default function Auth() {
  const { t } = useTranslation();
  const { getFontFamily } = useFontFamily();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role: 'farmer'
  });

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/me');
    }
  }, [navigate]);

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login logic
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const result = await response.json();
        
        if (result.success) {
          localStorage.setItem('token', result.data.session_token);
          localStorage.setItem('user', JSON.stringify(result.data.user));
          navigate('/me');
        } else {
          alert(result.message);
        }
      } else {
        // Register logic
        if (formData.password !== formData.confirmPassword) {
          alert('Mật khẩu xác nhận không khớp');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: formData.role,
            full_name: formData.full_name
          })
        });

        const result = await response.json();
        
        if (result.success) {
          alert('Đăng ký thành công! Vui lòng đăng nhập.');
          setIsLogin(true);
          setFormData({
            email: formData.email,
            phone: '',
            password: '',
            confirmPassword: '',
            full_name: '',
            role: 'farmer'
          });
        } else {
          alert(result.message);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-agro-green-light to-agro-green flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl ${getFontFamily('heading')} text-agro-green`}>
              AgroConnect
            </CardTitle>
            <CardDescription>
              {isLogin ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(value) => setIsLogin(value === 'login')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('auth.loginTab')}</TabsTrigger>
                <TabsTrigger value="register">{t('auth.registerTab')}</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder={t('auth.emailPlaceholder')}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.passwordPlaceholder')}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-agro-green hover:bg-agro-dark" disabled={loading}>
                    {loading ? t('auth.processing') : t('auth.loginAction')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">{t('auth.fullName')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder={t('auth.fullNamePlaceholder')}
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder={t('auth.emailPlaceholder')}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone">{t('auth.phoneOptional')}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder={t('auth.phonePlaceholder')}
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-role">{t('auth.role')}</Label>
                    <Select value={formData.role} onValueChange={(value: any) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('auth.rolePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer">{t('roles.farmer')}</SelectItem>
                        <SelectItem value="business">{t('roles.business')}</SelectItem>
                        <SelectItem value="consumer">{t('roles.consumer')}</SelectItem>
                        <SelectItem value="esg_expert">{t('roles.esg_expert')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.passwordPlaceholder')}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">{t('auth.confirmPassword')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-agro-green hover:bg-agro-dark" disabled={loading}>
                    {loading ? t('auth.processing') : t('auth.registerAction')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
