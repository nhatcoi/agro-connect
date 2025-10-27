import { useEffect, useRef, useState } from 'react';
import * as QrScanner from 'qr-scanner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Camera, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export default function QRScanner({ isOpen, onClose, onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    try {
      setError('');
      setIsScanning(true);

      if (!videoRef.current) return;

      // Check if camera is available
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        setError('Không tìm thấy camera trên thiết bị');
        return;
      }

      qrScannerRef.current = new QrScanner.QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          onScan(result.data);
          stopScanner();
          onClose();
        },
        {
          onDecodeError: (error) => {
            // Ignore decode errors during scanning
            console.log('QR decode error:', error);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await qrScannerRef.current.start();
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Không thể khởi động camera. Vui lòng kiểm tra quyền truy cập camera.');
    }
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Quét mã QR</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 bg-black rounded-lg"
                playsInline
                muted
              />
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 text-white px-4 py-2 rounded-lg">
                    Đang quét...
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Đóng
            </Button>
            {error && (
              <Button onClick={startScanner}>
                <Camera className="h-4 w-4 mr-2" />
                Thử lại
              </Button>
            )}
          </div>

          <div className="text-sm text-muted-foreground text-center">
            <p>Hướng camera vào mã QR để quét</p>
            <p>Đảm bảo mã QR nằm trong khung quét</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
