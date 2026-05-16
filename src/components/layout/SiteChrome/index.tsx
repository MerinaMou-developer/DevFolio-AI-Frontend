"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MarketingHeader } from "@/components/features/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/features/marketing/MarketingFooter";

const MARKETING_PATHS = [
  "/",
  "/about",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

function isMarketingPath(pathname: string) {
  if (pathname.startsWith("/dashboard")) return false;
  if (MARKETING_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/portfolio/")) return true;
  return false;
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const marketing = isMarketingPath(pathname);

  if (pathname.startsWith("/dashboard")) {
    return <>{children}</>;
  }

  if (marketing) {
    return (
      <div className="page-light min-h-screen">
        <MarketingHeader />
        <main>{children}</main>
        <MarketingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh">
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </div>
  );
}
