import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFontFamily } from '@/hooks/useFontFamily';

// Set up pdfjs worker - use unpkg CDN with exact version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`;

export default function Documentation() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getFontFamily } = useFontFamily();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<string>('');

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError('');
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setError('Không thể tải tài liệu PDF. Vui lòng thử lại sau.');
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/agro.pdf';
    link.download = 'AgroConnect-Documentation.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại</span>
              </Button>
              <div>
                <h1 className={`text-2xl font-bold ${getFontFamily('heading')}`}>
                  Tài liệu AgroConnect
                </h1>
                <p className="text-muted-foreground">
                  Hướng dẫn sử dụng và tài liệu kỹ thuật
                </p>
              </div>
            </div>
            <Button onClick={downloadPDF} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Tải xuống PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Controls */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Trang {pageNumber} / {numPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={scale >= 3.0}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center">
          <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
            {error ? (
              <div className="p-8 text-center">
                <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Lỗi tải tài liệu</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Thử lại
                </Button>
              </div>
            ) : (
              <Document
                file="/agro.pdf"
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agro-green mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Đang tải tài liệu...</p>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  className="shadow-sm"
                />
              </Document>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Tài liệu AgroConnect - Nền tảng kết nối nông nghiệp bền vững
            </p>
            <p className="mt-1">
              Phiên bản 1.0.0 | Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
