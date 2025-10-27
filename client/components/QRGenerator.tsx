import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle,
  Download, 
  Copy, 
  CheckCircle, 
  ExternalLink,
  QrCode as QrCodeIcon,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  blockchainHash?: string;
  blockchainTxHash?: string;
  blockchainAvailable?: boolean;
}

export default function QRGenerator({ 
  isOpen, 
  onClose, 
  productId, 
  productName, 
  blockchainHash,
  blockchainTxHash,
  blockchainAvailable
}: QRGeneratorProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [traceabilityUrl, setTraceabilityUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && productId) {
      generateQRCode();
    }
  }, [isOpen, productId]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      setError('');

      // Generate QR data
      const qrData = {
        type: 'product_traceability',
        product_id: productId,
        blockchain_hash: blockchainHash || '',
        traceability_url: `${window.location.origin}/traceability/${productId}`,
        created_at: new Date().toISOString()
      };

      setTraceabilityUrl(qrData.traceability_url);

      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#2E7D32', // Agro green
          light: '#FFFFFF'
        }
      });

      setQrCodeDataURL(qrCodeDataURL);
    } catch (err) {
      console.error('Generate QR code error:', err);
      setError('Không thể tạo mã QR');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a');
      link.href = qrCodeDataURL;
      link.download = `qr-code-${productName.replace(/\s+/g, '-')}-${productId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Tải xuống thành công",
        description: "Mã QR đã được tải xuống",
      });
    }
  };

  const copyTraceabilityUrl = async () => {
    try {
      await navigator.clipboard.writeText(traceabilityUrl);
      setCopied(true);
      toast({
        title: "Đã sao chép",
        description: "URL truy xuất đã được sao chép vào clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy error:', err);
      toast({
        title: "Lỗi",
        description: "Không thể sao chép URL",
        variant: "destructive",
      });
    }
  };

  const openTraceabilityPage = () => {
    window.open(traceabilityUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <QrCodeIcon className="h-5 w-5" />
            <span>Mã QR sản phẩm</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agro-green mx-auto mb-2"></div>
                <p className="text-muted-foreground">Đang tạo mã QR...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={generateQRCode}>Thử lại</Button>
            </div>
          ) : qrCodeDataURL ? (
            <div className="space-y-4">
              {/* QR Code Display */}
              <div className="text-center">
                <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
                  <img 
                    src={qrCodeDataURL} 
                    alt="QR Code" 
                    className="w-64 h-64"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Mã QR cho sản phẩm: {productName}
                </p>
              </div>

              {/* Blockchain Verification */}
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  {blockchainAvailable ? (
                    <>
                      <Shield className="h-4 w-4 text-green-600" />
                      <Badge variant="default" className="bg-green-500 flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Blockchain Connected</span>
                      </Badge>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <span>Blockchain Offline</span>
                      </Badge>
                    </>
                  )}
                </div>
                
                {blockchainHash && (
                  <div className="text-xs text-muted-foreground text-center">
                    <p>Hash: {blockchainHash.slice(0, 16)}...</p>
                  </div>
                )}
                
                {blockchainTxHash && (
                  <div className="text-xs text-muted-foreground text-center">
                    <p>TX: 
                      <a 
                        href={`https://amoy.polygonscan.com/tx/${blockchainTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline ml-1"
                      >
                        {blockchainTxHash.slice(0, 10)}...
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {/* Traceability URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">URL truy xuất:</label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-xs bg-muted p-2 rounded truncate">
                    {traceabilityUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyTraceabilityUrl}
                    className="shrink-0"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button onClick={downloadQRCode} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </Button>
                <Button 
                  variant="outline" 
                  onClick={openTraceabilityPage}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Xem truy xuất
                </Button>
              </div>

              {/* Instructions */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Mã QR chứa thông tin truy xuất nguồn gốc sản phẩm</p>
                <p>• Quét mã QR để xem thông tin chi tiết về sản phẩm</p>
                <p>• Thông tin được xác thực bằng công nghệ Blockchain</p>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
