import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Metadata } from "next";
import { ConvexClientProvider } from "@/components/convex-provider";

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
        <ConvexClientProvider>
          <main>{children}</main>
        </ConvexClientProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
