import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

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
        <p className="text-lg text-muted-foreground mb-4">{t('notFound.message')}</p>
        <div className="flex items-center gap-3 justify-center">
          <a href="/me" className="text-agro-green underline">{t('common.home')}</a>
          <a href="/features" className="text-muted-foreground underline">{t('notFound.viewFeatures')}</a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
