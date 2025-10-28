import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-2 text-agro-green">404</h1>
        <p className="text-lg text-muted-foreground mb-4">Không tìm thấy trang bạn yêu cầu.</p>
        <div className="flex items-center gap-3 justify-center">
          <a href="/me" className="text-agro-green underline">Về trang chủ</a>
          <a href="/features" className="text-muted-foreground underline">Xem danh mục chức năng</a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
