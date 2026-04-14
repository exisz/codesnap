import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAdSense from "@/components/GoogleAdSense";
import VercelAnalytics from "@/components/VercelAnalytics";

export const metadata: Metadata = {
  title: {
    default: "CodeSnap — Beautiful Code Screenshots",
    template: "%s | CodeSnap",
  },
  description:
    "Create beautiful screenshots of your source code. Free, fast, and no account required. Export as PNG or SVG.",
  openGraph: {
    title: "CodeSnap — Beautiful Code Screenshots",
    description:
      "Create beautiful screenshots of your source code. Free, fast, and no account required.",
    url: "https://codesnap.starmap.quest",
    siteName: "CodeSnap",
    locale: "en_AU",
    type: "website",
  },
  alternates: {
    canonical: "https://codesnap.starmap.quest",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="night">
      <head>
        <GoogleAnalytics />
        <GoogleAdSense />
      </head>
      <body className="min-h-dvh bg-[#0a0a0f] text-white flex flex-col">
        <VercelAnalytics />
        {children}
        <footer className="text-center py-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} CodeSnap · Built by{" "}
            <a
              href="https://rollersoft.com.au"
              className="text-purple-400 hover:text-purple-300"
            >
              Rollersoft
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
