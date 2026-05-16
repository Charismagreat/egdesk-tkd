import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SidebarWrapper from "@/components/SidebarWrapper";
import PWARegister from "@/components/PWARegister";
import MobileRedirect from "@/components/MobileRedirect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EG DESK | AI Taekwondo Management",
  description: "AI-powered Taekwondo management system",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EG DESK",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#2563EB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  let didUnregister = false;
                  for(let registration of registrations) {
                    registration.unregister();
                    didUnregister = true;
                  }
                  if (didUnregister) {
                    window.location.reload();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full" suppressHydrationWarning style={{ margin: 0, padding: 0 }}>
        <MobileRedirect />
        <PWARegister />
        <SidebarWrapper>
          {children}
        </SidebarWrapper>
      </body>
    </html>
  );
}
