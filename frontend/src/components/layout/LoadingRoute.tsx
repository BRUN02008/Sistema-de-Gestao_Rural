import { Loader2 } from "lucide-react";

export function LoadingRoute() {
  return (
    <div className="flex min-h-[280px] items-center justify-center text-[#607368]">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Carregando...
    </div>
  );
}
