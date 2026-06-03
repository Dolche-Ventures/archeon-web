"use client";

import { Badge } from "@workspace/ui/components/badge";
import { useEffect, useState } from "react";

import { AnimatedBlock } from "@/hooks/use-data-assembly";
import { SanityButtons } from "../elements/sanity-buttons";

type ServicePillarsSectionProps = any;
type SubService = any;

export function ServicePillarsSection({
  eyebrow,
  title,
  description,
  pillars,
}: ServicePillarsSectionProps) {
  const [selectedSubService, setSelectedSubService] = useState<
    Record<number, number | null>
  >({});
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const defaults: Record<number, number> = {};
    pillars?.forEach((pillar: any, index: number) => {
      if (pillar?.subServices && pillar.subServices.length > 0) {
        defaults[index] = 0;
      }
    });
    setSelectedSubService(defaults);
  }, [pillars]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    setTimeout(handleHashChange, 500);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const selectSubService = (pillarIndex: number, subServiceIndex: number) => {
    if (selectedSubService[pillarIndex] === subServiceIndex) return;
    setIsAnimating(true);
    setSelectedSubService((prev) => ({
      ...prev,
      [pillarIndex]: subServiceIndex,
    }));
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedBlock>
          <div className="mb-16 flex w-full flex-col items-center text-center">
            {eyebrow && (
              <span className="mb-4 text-sm font-medium uppercase tracking-wider text-foreground">
                {eyebrow}
              </span>
            )}
            <h2 className="text-balance font-semibold text-3xl leading-tight md:text-4xl text-foreground">
              {title}
            </h2>
            {description && (
              <p className="mt-4 max-w-2xl text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </AnimatedBlock>

        <div className="space-y-24">
          {pillars?.map((pillar: any, pillarIndex: number) => {
            const selectedIndex = selectedSubService[pillarIndex];
            const selectedSubServiceData =
              pillar?.subServices?.[selectedIndex ?? -1];
            const isLast = pillarIndex === (pillars?.length ?? 0) - 1;

            return (
              <AnimatedBlock key={pillarIndex} delay={pillarIndex * 100}>
                <div
                  id={pillar?.anchorId}
                  className="flex flex-col scroll-mt-20"
                  data-anchor-id={pillar?.anchorId}
                >
                  {pillar?.eyebrow && (
                    <div className="mb-2 flex justify-center">
                      <Badge variant="secondary">{pillar.eyebrow}</Badge>
                    </div>
                  )}
                  <h3 className="mb-2 text-center text-2xl font-semibold md:text-3xl text-foreground">
                    {pillar?.title}
                  </h3>
                  {pillar?.description && (
                    <p className="mb-8 text-center text-muted-foreground">
                      {pillar.description}
                    </p>
                  )}

                  <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                    <div className="space-y-2">
                      {pillar?.subServices?.map(
                        (subService: any, subIndex: number) => {
                          const isActive = selectedIndex === subIndex;
                          return (
                            <button
                              key={subIndex}
                              type="button"
                              onClick={() =>
                                selectSubService(pillarIndex, subIndex)
                              }
                              className={`group flex w-full items-center gap-3 rounded-xl px-5 py-4 text-left transition-all duration-200 ${
                                isActive
                                  ? "bg-foreground/10 border border-foreground/30"
                                  : "hover:bg-muted hover:-translate-y-[1px]"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full transition-colors ${
                                  isActive
                                    ? "bg-foreground"
                                    : "bg-muted-foreground/30 group-hover:bg-foreground"
                                }`}
                              />
                              <p
                                className={`text-sm ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                              >
                                {subService?.title}
                              </p>
                            </button>
                          );
                        }
                      )}
                    </div>

                    <div
                      className={`relative rounded-2xl border border-border/30 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900/50 p-8 shadow-lg shadow-zinc-500/5 transition-all duration-300 ease-in-out ${
                        isAnimating
                          ? "opacity-0 translate-y-2"
                          : "opacity-100 translate-y-0"
                      }`}
                    >
                      {selectedSubServiceData ? (
                        <>
                          <p className="text-xs text-muted-foreground/60 tracking-widest mb-2">
                            SERVICE
                          </p>
                          <h4 className="text-xl font-semibold text-foreground mb-4">
                            {selectedSubServiceData.title}
                          </h4>
                          <div className="border-b border-border mb-4" />
                          {selectedSubServiceData.description ? (
                            <ul className="space-y-1.5 list-disc list-inside text-sm text-muted-foreground leading-relaxed">
                              {selectedSubServiceData.description
                                .split("\n")
                                .filter((l: string) => l.trim())
                                .map((line: string, i: number) => (
                                  <li key={i}>
                                    {line.trim().replace(/^[-•*]\s*/, "")}
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              No description added yet
                            </p>
                          )}
                          {(selectedSubServiceData as SubService)?.ctaText &&
                            (selectedSubServiceData as SubService)?.ctaLink && (
                              <a
                                href={`/send-an-inquiry?service=${encodeURIComponent(((selectedSubServiceData as SubService)?.title || "").replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u2060-\u2064]/g, ""))}`}
                                target={
                                  (
                                    (selectedSubServiceData as SubService)
                                      .ctaLink as any
                                  )?.openInNewTab
                                    ? "_blank"
                                    : undefined
                                }
                                rel={
                                  (
                                    (selectedSubServiceData as SubService)
                                      .ctaLink as any
                                  )?.openInNewTab
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                className="mt-6 inline-block text-sm text-foreground hover:underline"
                              >
                                {(selectedSubServiceData as SubService).ctaText}{" "}
                                →
                              </a>
                            )}
                        </>
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          Select a service
                        </div>
                      )}
                    </div>
                  </div>

                  {(pillar?.ctaTitle || pillar?.ctaDescription || pillar?.buttons?.length) && (
                    <div className="mt-12 flex flex-col items-center text-center">
                      {pillar.ctaTitle && (
                        <h4 className="text-xl font-semibold md:text-2xl text-foreground">
                          {pillar.ctaTitle}
                        </h4>
                      )}
                      {pillar.ctaDescription && (
                        <p className="mt-3 max-w-lg text-muted-foreground">
                          {pillar.ctaDescription}
                        </p>
                      )}
                      {pillar?.buttons?.length && (
                        <div className="mt-5">
                          <SanityButtons buttons={pillar.buttons} />
                        </div>
                      )}
                    </div>
                  )}

                  {!isLast && (
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-12" />
                  )}
                </div>
              </AnimatedBlock>
            );
          })}
        </div>
      </div>
    </section>
  );
}
