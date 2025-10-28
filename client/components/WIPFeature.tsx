import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Wrench } from "lucide-react";

export default function WIPFeature() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const title = params.get("title") || "Tính năng đang phát triển";
  const desc = params.get("desc") || "Chúng tôi đang hoàn thiện chức năng này. Vui lòng quay lại sau.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-agro-green-light flex items-center justify-center">
            <Wrench className="w-6 h-6 text-agro-green" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">{desc}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline">Quay lại</Button>
            <Button onClick={() => navigate("/me")}>Về trang chủ</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


