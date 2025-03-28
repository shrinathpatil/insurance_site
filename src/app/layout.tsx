import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication for this insurance application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#fefefe]">
        <main>{children}</main>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
