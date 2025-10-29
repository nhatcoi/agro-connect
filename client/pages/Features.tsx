import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { QrCode, Leaf, Users, Building2, FileCheck2, ScanLine, MapPin, FileSignature, ShieldCheck, BookOpen, ShoppingBasket, Image as ImageIcon, Boxes, Handshake, ClipboardList, Activity } from "lucide-react";

type FeatureItem = {
  code: string;
  title: string;
  desc: string;
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function Features() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const items: FeatureItem[] = [
    // 3.1 Đăng ký & hồ sơ
    { code: "UC-01", title: t('featuresPage.uc01.title'), desc: t('featuresPage.uc01.desc'), to: "/auth", icon: Users },
    { code: "UC-02", title: t('featuresPage.uc02.title'), desc: t('featuresPage.uc02.desc'), to: "/me/profile", icon: Leaf },
    { code: "UC-03", title: t('featuresPage.uc03.title'), desc: t('featuresPage.uc03.desc'), to: "/me/review", icon: ShieldCheck },

    // 3.2 Nông dân/HTX
    { code: "UC-10", title: t('featuresPage.uc10.title'), desc: t('featuresPage.uc10.desc'), to: "/me/seasons", icon: MapPin },
    { code: "UC-11", title: t('featuresPage.uc11.title'), desc: t('featuresPage.uc11.desc'), to: "/me/images", icon: ImageIcon },
    { code: "UC-12", title: t('featuresPage.uc12.title'), desc: t('featuresPage.uc12.desc'), to: "/me/products", icon: Boxes },
    { code: "UC-13", title: t('featuresPage.uc13.title'), desc: t('featuresPage.uc13.desc'), to: "/me/partners", icon: Handshake },
    { code: "UC-14", title: t('featuresPage.uc14.title'), desc: t('featuresPage.uc14.desc'), to: "/me/orders", icon: ShoppingBasket },

    // 3.3 Doanh nghiệp
    { code: "UC-20", title: t('featuresPage.uc20.title'), desc: t('featuresPage.uc20.desc'), icon: ClipboardList },
    { code: "UC-21", title: t('featuresPage.uc21.title'), desc: t('featuresPage.uc21.desc'), icon: Building2 },
    { code: "UC-22", title: t('featuresPage.uc22.title'), desc: t('featuresPage.uc22.desc'), icon: FileSignature },
    { code: "UC-23", title: t('featuresPage.uc23.title'), desc: t('featuresPage.uc23.desc'), to: "/me/esg", icon: FileCheck2 },

    // 3.4 Truy xuất (Blockchain + QR)
    { code: "UC-30", title: t('featuresPage.uc30.title'), desc: t('featuresPage.uc30.desc'), to: "/qr-demo", icon: QrCode },
    { code: "UC-31", title: t('featuresPage.uc31.title'), desc: t('featuresPage.uc31.desc'), to: "/traceability/1", icon: ScanLine },
    { code: "UC-32", title: t('featuresPage.uc32.title'), desc: t('featuresPage.uc32.desc'), to: "/qr-demo", icon: ScanLine },
    { code: "UC-33", title: t('featuresPage.uc33.title'), desc: t('featuresPage.uc33.desc'), icon: ShieldCheck },

    // 3.5 ESG Scoring
    { code: "UC-40", title: t('featuresPage.uc40.title'), desc: t('featuresPage.uc40.desc'), to: "/me/esg", icon: Leaf },
    { code: "UC-41", title: t('featuresPage.uc41.title'), desc: t('featuresPage.uc41.desc'), to: "/me/esg", icon: Users },
    { code: "UC-42", title: t('featuresPage.uc42.title'), desc: t('featuresPage.uc42.desc'), to: "/me/esg", icon: FileCheck2 },
    { code: "UC-43", title: t('featuresPage.uc43.title'), desc: t('featuresPage.uc43.desc'), to: "/me/review", icon: ShieldCheck },
    { code: "UC-44", title: t('featuresPage.uc44.title'), desc: t('featuresPage.uc44.desc'), icon: FileCheck2 },

    // 3.6 Đào tạo & thị trường
    { code: "UC-50", title: t('featuresPage.uc50.title'), desc: t('featuresPage.uc50.desc'), icon: BookOpen },
    { code: "UC-51", title: t('featuresPage.uc51.title'), desc: t('featuresPage.uc51.desc'), icon: Activity },
    { code: "UC-52", title: t('featuresPage.uc52.title'), desc: t('featuresPage.uc52.desc'), icon: Leaf },
    { code: "UC-53", title: t('featuresPage.uc53.title'), desc: t('featuresPage.uc53.desc'), icon: Users },
  ];

  const go = (item: FeatureItem) => {
    if (item.to) {
      navigate(item.to);
    } else {
      const params = new URLSearchParams({ title: `${item.code} – Tính năng đang phát triển`, desc: item.desc });
      navigate(`/wip?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('featuresPage.title')}</h1>
          <Button variant="outline" onClick={() => navigate("/me")}>{t('common.home')}</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.code} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3">
                <item.icon className="w-5 h-5 text-agro-green" />
                <CardTitle className="text-base">{item.code} – {item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                <Button size="sm" onClick={() => go(item)}>{t('common.open')}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


