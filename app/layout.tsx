import "./globals.css";
import { Toaster } from "@/app/components/ui/toaster";
import { ThemeProvider } from "@/app/components/ui/theme-provider";
import { Metadata } from "next";
import localFont from "next/font/local";
export const dynamic = 'force-dynamic'

const satoshiFont = localFont({
  src: "./fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
});


export const metadata: Metadata = {
  title: "Nbias",
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
