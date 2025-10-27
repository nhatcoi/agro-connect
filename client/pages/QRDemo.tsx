import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import SimpleQRScanner from '@/components/SimpleQRScanner';
import QRGenerator from '@/components/QRGenerator';

export default function QRDemo() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [productId, setProductId] = useState<string>('1');
  const [productName, setProductName] = useState<string>('Lúa gạo hữu cơ');
  const [blockchainHash, setBlockchainHash] = useState<string>('');

  const handleScan = (result: string) => {
    setScanResult(result);
    console.log('QR Code scanned:', result);
  };

  const handleGenerateQR = () => {
    setIsGeneratorOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Demo QR Code System</h1>
          <p className="text-muted-foreground">
            Hệ thống sinh và quét mã QR cho truy xuất nguồn gốc sản phẩm
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* QR Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>QR Scanner</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Nhập dữ liệu QR code để xem thông tin truy xuất sản phẩm
              </p>
              
              <Button 
                onClick={() => setIsScannerOpen(true)}
                className="w-full"
              >
                <Camera className="h-4 w-4 mr-2" />
                Mở QR Scanner
              </Button>

              {scanResult && (
                <div className="space-y-2">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      QR Code đã được quét thành công!
                    </AlertDescription>
                  </Alert>
                  <div>
                    <Label>Kết quả quét:</Label>
                    <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                      {scanResult}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-5 w-5" />
                <span>QR Generator</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Tạo mã QR cho sản phẩm với thông tin truy xuất
              </p>

              <div className="space-y-2">
                <Label htmlFor="productId">Product ID</Label>
                <Input
                  id="productId"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="Nhập ID sản phẩm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Tên sản phẩm</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blockchainHash">Blockchain Hash (tùy chọn)</Label>
                <Input
                  id="blockchainHash"
                  value={blockchainHash}
                  onChange={(e) => setBlockchainHash(e.target.value)}
                  placeholder="Nhập blockchain hash"
                />
              </div>
              
              <Button 
                onClick={handleGenerateQR}
                className="w-full"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Tạo Mã QR
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Tính năng UC-30</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">QR Code Generation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tạo mã QR chứa thông tin sản phẩm</li>
                  <li>• Blockchain hash để xác thực</li>
                  <li>• URL truy xuất nguồn gốc</li>
                  <li>• Tải xuống mã QR dạng PNG</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">QR Code Scanning</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Quét mã QR bằng camera</li>
                  <li>• Xác thực blockchain hash</li>
                  <li>• Hiển thị thông tin truy xuất</li>
                  <li>• Lịch sử đơn hàng</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn sử dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Để tạo mã QR:</h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  <li>Nhập ID sản phẩm và tên sản phẩm</li>
                  <li>Nhập blockchain hash (tùy chọn)</li>
                  <li>Nhấn "Tạo Mã QR"</li>
                  <li>Tải xuống hoặc chia sẻ mã QR</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Để quét mã QR:</h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  <li>Nhấn "Mở QR Scanner"</li>
                  <li>Nhập dữ liệu QR code vào ô text</li>
                  <li>Hoặc upload file ảnh chứa QR code</li>
                  <li>Xem kết quả quét</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Scanner Modal */}
      <SimpleQRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScan}
      />

      {/* QR Generator Modal */}
      <QRGenerator
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        productId={Number(productId)}
        productName={productName}
        blockchainHash={blockchainHash || undefined}
      />
    </div>
  );
}
