import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { DirectionProvider } from "@radix-ui/react-direction";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/config";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} — פיתוח שחקנים בין האימונים`,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <DirectionProvider dir="rtl">{children}</DirectionProvider>
      </body>
    </html>
  );
}
