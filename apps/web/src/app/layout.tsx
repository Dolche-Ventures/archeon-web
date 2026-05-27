import "@workspace/ui/globals.css";

import { sanityFetch, SanityLive } from "@workspace/sanity/live";
import { querySettingsData } from "@workspace/sanity/query";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Suspense } from "react";
import { preconnect, prefetchDNS } from "react-dom";

import { FooterServer, FooterSkeleton } from "@/components/footer";
import { CombinedJsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { PreviewBar } from "@/components/preview-bar";
import { Providers } from "@/components/providers";
import { ScrollProgressWrapper } from "@/components/scroll-progress-wrapper";
import { getNavigationData } from "@/lib/navigation";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");
  const nav = await getNavigationData();
  const settings = await sanityFetch({ query: querySettingsData });
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <Providers>
          <ScrollProgressWrapper />
          <Navbar navbarData={nav.navbarData} settingsData={nav.settingsData} />
          <div className="relative bg-zinc-300 dark:bg-zinc-800 p-3 md:p-4 overflow-hidden shadow-inner">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.1)_0%,transparent_40%),linear-gradient(250deg,rgba(0,0,0,0.1)_0%,transparent_55%),linear-gradient(45deg,rgba(255,255,255,0.08)_0%,transparent_65%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]" />
            <div className="relative z-10 bg-background min-h-screen rounded-xl border border-border/60 shadow-lg">
              {children}
            </div>
          </div>
          <Suspense fallback={<FooterSkeleton />}>
            <FooterServer />
          </Suspense>
          <SanityLive />
          <CombinedJsonLd settings={settings.data} includeOrganization includeWebsite />
          {(await draftMode()).isEnabled && (
            <>
              <PreviewBar />
              <VisualEditing />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}
