import type { Metadata } from "next";
import SessionProvider from "@/components/Providers/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hod",
  description: "Initiative tracker for DnD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
