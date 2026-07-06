import { Loader2 } from "lucide-react";

export function LoadingState({ label = "טוען…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
