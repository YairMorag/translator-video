import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { APP_NAME } from "@/lib/config";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link href="/" className="flex items-center justify-center gap-2 text-primary">
          <ShieldCheck className="h-6 w-6" />
          <span className="text-lg font-semibold">{APP_NAME}</span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>התחברות</CardTitle>
            <CardDescription>
              גישה ללוח הבקרה לפיתוח שחקנים של בית הספר שלכם.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          רק מסתכלים?{" "}
          <Link href="/demo" className="font-medium text-accent hover:underline">
            נסו חשבונות הדגמה מיידיים
          </Link>
        </p>
      </div>
    </div>
  );
}
