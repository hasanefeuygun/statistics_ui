import "./globals.css";

import { SocketProvider } from "@/providers/SocketProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0B0B0F] text-zinc-100">
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
