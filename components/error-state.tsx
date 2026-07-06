import { AlertOctagon } from "lucide-react";

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again. If the problem continues, contact your school admin.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-destructive-soft bg-destructive-soft/40 px-6 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive-soft text-destructive">
        <AlertOctagon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-destructive">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
