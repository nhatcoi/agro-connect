import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Leaf, Facebook, Linkedin, Send } from 'lucide-react';
import { useFontFamily } from '@/hooks/useFontFamily';

export default function Blog() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getFontFamily } = useFontFamily();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header (same style as About) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 min-h-[64px]">
            <div className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-agro-green" />
              <span className={`text-xl ${getFontFamily('heading')} font-bold text-agro-green`}>
                AgroConnect
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2">
                {t('about.backToHome')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Table of contents */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-2 text-sm">
              <div className="font-semibold mb-2">Mục lục</div>
              <button className="block text-left text-muted-foreground hover:text-foreground" onClick={() => navigate('/blog#intro')}>Giới thiệu</button>
              <button className="block text-left text-muted-foreground hover:text-foreground" onClick={() => navigate('/blog#esg-policy')}>Chính sách ESG</button>
              <button className="block text-left text-muted-foreground hover:text-foreground" onClick={() => navigate('/blog#partners')}>Đối tác</button>
              <button className="block text-left text-muted-foreground hover:text-foreground" onClick={() => navigate('/blog#other')}>Thêm bài khác</button>
            </div>
          </aside>

          {/* Articles */}
          <main className="lg:col-span-9 space-y-12">
            {/* Intro Article */}
            <article id="intro" className="scroll-mt-24 bg-card border rounded-xl p-6 shadow-sm">
              <header className="mb-4">
                <h1 className={`text-2xl ${getFontFamily('heading')} font-bold mb-1`}>Giới thiệu AgroConnect</h1>
                <div className="text-xs text-muted-foreground">Tác giả: AgroConnect • 5 phút đọc • {new Date().toLocaleDateString()}</div>
              </header>
              <div className={`${getFontFamily('body')} prose prose-sm max-w-none text-foreground prose-headings:font-semibold prose-p:leading-relaxed`}> 
                <p>AgroConnect là nền tảng kết nối nông dân, hợp tác xã và doanh nghiệp thông qua minh bạch ESG và truy xuất nguồn gốc blockchain.</p>
                <p>Mục tiêu là nâng cao thu nhập nông dân, tối ưu chuỗi cung ứng và xây dựng niềm tin với người tiêu dùng.</p>
              </div>
              <footer className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">#giới_thiệu</span>
                <span className="px-2 py-1 bg-muted rounded">#agroconnect</span>
              </footer>
            </article>

            {/* ESG Policy Article */}
            <article id="esg-policy" className="scroll-mt-24 bg-card border rounded-xl p-6 shadow-sm">
              <header className="mb-4">
                <h2 className={`text-xl ${getFontFamily('heading')} font-bold mb-1`}>Chính sách ESG</h2>
                <div className="text-xs text-muted-foreground">Tác giả: AgroConnect • 6 phút đọc • {new Date().toLocaleDateString()}</div>
              </header>
              <div className={`${getFontFamily('body')} prose prose-sm max-w-none text-foreground`}>
                <p>ESG (Environment, Social, Governance) là bộ tiêu chí đánh giá bền vững. Chúng tôi hỗ trợ doanh nghiệp và nông dân tuân thủ ESG, chấm điểm minh bạch và cung cấp báo cáo nhằm đáp ứng yêu cầu thị trường.</p>
                <p>Các tiêu chí gồm: môi trường (phát thải, nước, rác thải), xã hội (an toàn, bình đẳng), quản trị (minh bạch dữ liệu).</p>
              </div>
              <footer className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">#esg</span>
                <span className="px-2 py-1 bg-muted rounded">#bền_vững</span>
              </footer>
            </article>

            {/* Partners Article */}
            <article id="partners" className="scroll-mt-24 bg-card border rounded-xl p-6 shadow-sm">
              <header className="mb-4">
                <h2 className={`text-xl ${getFontFamily('heading')} font-bold mb-1`}>Đối tác</h2>
                <div className="text-xs text-muted-foreground">Tác giả: AgroConnect • 4 phút đọc • {new Date().toLocaleDateString()}</div>
              </header>
              <div className={`${getFontFamily('body')} prose prose-sm max-w-none text-foreground`}>
                <p>AgroConnect hợp tác với các tổ chức nông nghiệp, doanh nghiệp thu mua, và chuyên gia ESG để đảm bảo tiêu chuẩn chất lượng và phát triển thị trường nông sản bền vững.</p>
                <p>Chúng tôi chào đón các đối tác chiến lược cùng xây dựng hệ sinh thái nông nghiệp số.</p>
              </div>
              <footer className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">#đối_tác</span>
                <span className="px-2 py-1 bg-muted rounded">#hợp_tác</span>
              </footer>
            </article>

            {/* Other Article */}
            <article id="other" className="scroll-mt-24 bg-card border rounded-xl p-6 shadow-sm">
              <header className="mb-4">
                <h2 className={`text-xl ${getFontFamily('heading')} font-bold mb-1`}>Thêm bài khác</h2>
                <div className="text-xs text-muted-foreground">Tác giả: AgroConnect • 3 phút đọc • {new Date().toLocaleDateString()}</div>
              </header>
              <div className={`${getFontFamily('body')} prose prose-sm max-w-none text-foreground`}>
                <p>Tổng hợp tin tức, hướng dẫn sử dụng, câu chuyện thành công và tài nguyên học tập về nông nghiệp xanh.</p>
                <p>Đón xem các cập nhật sắp tới về tính năng và nghiên cứu thị trường.</p>
              </div>
              <footer className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">#tin_tức</span>
                <span className="px-2 py-1 bg-muted rounded">#hướng_dẫn</span>
              </footer>
            </article>
          </main>
        </div>
      </div>

      
    </div>
  );
}


