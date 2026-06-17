"use client";

import { env } from "@workspace/env/client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

import type { ColumnLink, NavColumn, NavigationData } from "@/types";
import { MenuLink } from "./elements/menu-link";
import { SanityButtons } from "./elements/sanity-buttons";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { ModeToggle } from "./mode-toggle";

const fetcher = async (url: string): Promise<NavigationData> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch navigation data");
  return response.json();
};

function DesktopColumnDropdown({
  column,
}: {
  column: Extract<NavColumn, { type: "column" }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const hasActiveChild = column.links?.some(
    (link) =>
      pathname === link.href ||
      (link.href != null &&
        link.href !== "/" &&
        pathname.startsWith(link.href))
  );

  return (
    <div className="group relative">
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`flex items-center gap-1 px-3 py-2 font-medium text-sm rounded-lg transition-all duration-200 ${
          hasActiveChild
            ? "bg-muted text-foreground border border-border"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        type="button"
      >
        {column.title}
        <ChevronDown className={`size-3 transition-transform ${hasActiveChild ? "rotate-180" : "group-hover:rotate-180"}`} />
      </button>

      {isOpen ? (
        <div
          className="fade-in-0 zoom-in-95 absolute top-full left-0 z-50 min-w-[280px] animate-in rounded-lg border bg-popover p-2 shadow-lg"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          role="menu"
        >
          <div className="grid gap-1">
            {column.links?.map((link: ColumnLink) => (
              <MenuLink
                description={link.description || ""}
                href={link.href || ""}
                icon={link.icon}
                key={link._key}
                name={link.name || ""}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DesktopColumnLink({
  column,
}: {
  column: Extract<NavColumn, { type: "link" }>;
}) {
  const pathname = usePathname();
  if (!column.href) return null;

  const isActive =
    pathname === column.href ||
    (column.href !== "/" && pathname.startsWith(column.href));

  return (
    <Link
      className={`px-3 py-2 font-medium text-sm rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-muted text-foreground border border-border"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }`}
      href={column.href}
    >
      {column.name}
    </Link>
  );
}

function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex h-10 w-40 items-center">
            <div className="h-10 w-40 animate-pulse rounded bg-muted/50" />
          </div>

          <div className="h-10 w-10 animate-pulse rounded bg-muted/50 md:hidden" />
        </div>
      </div>
    </header>
  );
}

export function Navbar({
  navbarData: initialNavbarData,
  settingsData: initialSettingsData,
}: NavigationData) {
  const { data, error, isLoading } = useSWR<NavigationData>(
    "/api/navigation",
    fetcher,
    {
      fallbackData: {
        navbarData: initialNavbarData,
        settingsData: initialSettingsData,
      },
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: true,
      refreshInterval: 30_000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  const navigationData = data || {
    navbarData: initialNavbarData,
    settingsData: initialSettingsData,
  };

  const { navbarData, settingsData } = navigationData;
  const { columns, buttons } = navbarData || {};
  const { logo, siteTitle } = settingsData || {};
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "";

  if (isLoading && !data && !(initialNavbarData && initialSettingsData)) {
    return <NavbarSkeleton />;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className={`flex items-center shrink-0 transition-all duration-200 ${isHomePage ? "scale-110" : "hover:scale-105"}`}>
            {logo && <Logo alt={siteTitle || ""} image={logo} priority />}
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {columns?.map((column) => {
              if (column.type === "column") {
                return <DesktopColumnDropdown column={column} key={column._key} />;
              }

              if (column.type === "link") {
                return <DesktopColumnLink column={column} key={column._key} />;
              }

              return null;
            })}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <ModeToggle />
            <SanityButtons
              buttonClassName="rounded-lg"
              buttons={buttons || []}
              className="flex items-center gap-2"
            />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <MobileMenu navbarData={navbarData} settingsData={settingsData} />
          </div>
        </div>
      </div>

      {error && env.NODE_ENV === "development" && (
        <div className="border-destructive/20 border-b bg-destructive/10 px-4 py-2 text-destructive text-xs">
          Navigation data fetch error: {error.message}
        </div>
      )}
    </header>
  );
}