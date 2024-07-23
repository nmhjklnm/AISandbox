import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/app/components/ui/toaster";
import { ThemeProvider } from "@/app/components/ui/theme-provider";
import { Metadata } from "next";
import localFont from "next/font/local";

const satoshiFont = localFont({
  src: "./fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
});

export const metadata: Metadata = {
  title: "Nbias",
  metadataBase: new URL("http://localhost:3000"),
  icons: {
    icon: "https://raw.githubusercontent.com/Shubhamai/AISandbox/main/public/icon.svg",
    shortcut:
      "https://raw.githubusercontent.com/Shubhamai/AISandbox/main/public/icon.svg",
  },
  description: "Prototyping AI architectures in a node based editor.",
  openGraph: {
    title: "Workflow",
    description: "Prototyping AI architectures in a node based editor.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${satoshiFont.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div id="root" className="w-screen h-screen">
            {children}
          </div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
