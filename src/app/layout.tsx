import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import SessionProvider from "../components/providers/SessionProvider";
import DynamicFavicon from "../components/DynamicFavicon";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SDKThunder",
  description: "Sporta draugu klubs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} antialiased`}
      >
        <DynamicFavicon />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
