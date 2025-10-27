import { useTranslation } from 'react-i18next';

export function useFontFamily() {
  const { i18n } = useTranslation();
  
  // Return appropriate font family based on current language
  const getFontFamily = (type: 'heading' | 'body' = 'body') => {
    const isVietnamese = i18n.language === 'vi';
    
    if (type === 'heading') {
      return isVietnamese ? 'font-vietnam' : 'font-poppins';
    }
    
    return isVietnamese ? 'font-vietnam' : 'font-inter';
  };
  
  return { getFontFamily, isVietnamese: i18n.language === 'vi' };
}
