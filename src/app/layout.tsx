import type { Metadata } from "next";
import "./globals.css";
import { UIConfigProvider, UIProvider } from "@jamsr-ui/react";
import { ThemeProvider } from "@/context/ThemeContext";
import LayoutContent from "@/components/LayoutContent";

// Éco-conception : aucune Google Font n'est chargée. Le rendu s'appuie sur la
// pile de polices système (voir globals.css), ce qui évite ~2 requêtes réseau
// et le téléchargement de fichiers de polices inutiles.

export const metadata: Metadata = {
  title:
    "Precart – eCommerce website Template with JamsrUI, Next.js, & Tailwind CSS",
  description:
    "Precart – eCommerce website Template with JamsrUI, Next.js, & Tailwind CSS",
  icons: {
    icon: "/fevicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`antialiased  flex flex-col min-h-screen `}
      >
        <ThemeProvider>
          <UIProvider>
            <UIConfigProvider
              card={{
                isBordered: true,
                className: "border border-[hsl(210,9.8%,16.1%)] bg-transparent",
              }}
            >
                 <LayoutContent>{children}</LayoutContent>
            </UIConfigProvider>
          </UIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
