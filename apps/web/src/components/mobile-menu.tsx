"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { ColumnLink, NavigationData } from "@/types";
import { MenuLink } from "./elements/menu-link";
import { SanityButtons } from "./elements/sanity-buttons";
import { Logo } from "./logo";

export function MobileMenu({ navbarData, settingsData }: NavigationData) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setIsOpen(false);
  }

  const { columns, buttons } = navbarData || {};
  const { logo, siteTitle } = settingsData || {};
  const isHomePage = pathname === "/" || pathname === "";

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <Menu className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-sm flex flex-col px-0"
        showCloseButton={false}
      >
        <SheetHeader className="flex-row items-center px-6 justify-between pb-4 border-b">
          {logo ? (
            <div className={`[&_img]:w-auto [&_img]:h-6 [&_img]:rounded-none transition-all ${isHomePage ? "scale-110" : ""}`}>
              <Logo alt={siteTitle || ""} image={logo} />
            </div>
          ) : (
            <SheetTitle>{siteTitle || "Menu"}</SheetTitle>
          )}
          <SheetClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        {/* Navigation items - scrollable */}
        <nav className="flex-1 overflow-y-auto pt-4 grid px-6 gap-1 content-start">
          <Accordion type="single" collapsible>
            {columns?.map((column) => {
              if (column.type === "link") {
                if (!column.href) return null;

                const isActive = pathname === column.href || 
                  (column.href !== "/" && pathname.startsWith(column.href));

                return (
                  <Link
                    className={`flex items-center py-3 font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? "text-foreground scale-105"
                        : "hover:text-foreground hover:scale-105"
                    }`}
                    href={column.href}
                    key={column._key}
                    onClick={closeMenu}
                  >
                    {column.name}
                  </Link>
                );
              }

              if (column.type === "column") {
                const hasActiveChild = column.links?.some(
                  (link) =>
                    pathname === link.href ||
                    (link.href != null &&
                      link.href !== "/" &&
                      pathname.startsWith(link.href))
                );

                return (
                  <AccordionItem
                    key={column._key}
                    value={column._key}
                    className="border-b-0"
                  >
                    <AccordionTrigger className={`py-3 hover:no-underline ${hasActiveChild ? "text-foreground" : ""}`}>
                      {column.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-1 border-border border-l-2 pl-4 ml-1">
                        {column.links?.map((link: ColumnLink) => (
                          <MenuLink
                            description={link.description || ""}
                            href={link.href || ""}
                            icon={link.icon}
                            key={link._key}
                            name={link.name || ""}
                            onClick={closeMenu}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              return null;
            })}
          </Accordion>
        </nav>

        {buttons?.length && (
          <SheetFooter className="border-t">
            <SanityButtons
              buttonClassName="w-full justify-center"
              buttons={buttons || []}
              className="grid gap-3"
            />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
