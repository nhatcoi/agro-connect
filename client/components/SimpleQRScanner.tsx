import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Camera, AlertCircle, Upload } from 'lucide-react';

interface SimpleQRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export default function SimpleQRScanner({ isOpen, onClose, onScan }: SimpleQRScannerProps) {
  const [error, setError] = useState<string>('');
  const [qrData, setQrData] = useState<string>('');

  const handleManualInput = () => {
    if (qrData.trim()) {
      onScan(qrData.trim());
      setQrData('');
      onClose();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, just show a message that file upload is not implemented
      setError('Tính năng upload file QR code chưa được triển khai. Vui lòng nhập thủ công.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Quét mã QR</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Manual Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhập dữ liệu QR thủ công:</label>
              <textarea
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                placeholder="Dán dữ liệu QR code vào đây..."
                className="w-full p-2 border rounded-md resize-none"
                rows={3}
              />
              <Button 
                onClick={handleManualInput}
                disabled={!qrData.trim()}
                className="w-full"
              >
                <Camera className="h-4 w-4 mr-2" />
                Xử lý dữ liệu QR
              </Button>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Hoặc upload file QR code:</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500 mb-2">
                  Kéo thả file QR code vào đây
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="qr-file-upload"
                />
                <label
                  htmlFor="qr-file-upload"
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                >
                  Chọn file
                </label>
              </div>
            </div>

            {/* Instructions */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Nhập dữ liệu QR code vào ô text phía trên</p>
              <p>• Hoặc upload file ảnh chứa QR code</p>
              <p>• Dữ liệu QR sẽ được xử lý và hiển thị kết quả</p>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
