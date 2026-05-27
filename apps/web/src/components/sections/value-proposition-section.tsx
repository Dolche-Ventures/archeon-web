"use client";

import { Badge } from "@workspace/ui/components/badge";
import { useEffect, useRef, useState } from "react";

import { SanityButtons } from "../elements/sanity-buttons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValuePropositionSectionProps = any;

function renderTextWithHighlight(text: string, highlightWord: string) {
  if (!text) return null;

  const highlightIndex = text
    .toLowerCase()
    .indexOf(highlightWord.toLowerCase());
  const parts: { text: string; highlight: boolean }[] = [];

  if (highlightIndex === -1) {
    parts.push({ text, highlight: false });
  } else {
    if (highlightIndex > 0) {
      parts.push({ text: text.slice(0, highlightIndex), highlight: false });
    }
    parts.push({
      text: text.slice(highlightIndex, highlightIndex + highlightWord.length),
      highlight: true,
    });
    if (highlightIndex + highlightWord.length < text.length) {
      parts.push({
        text: text.slice(highlightIndex + highlightWord.length),
        highlight: false,
      });
    }
  }

  return parts.map((part, i) => (
    <span key={i}>
      {part.highlight ? (
        <>
          <span className="relative z-10 text-foreground dark:text-white font-semibold">
            {part.text}
          </span>
          <span className="absolute inset-0 -z-10 blur-sm text-foreground dark:text-white opacity-40">
            {part.text}
          </span>
        </>
      ) : (
        <span className="text-foreground dark:text-white/90">{part.text}</span>
      )}
    </span>
  ));
}

function SpotlightLine({
  text,
  highlightWord,
  index,
}: {
  text: string;
  highlightWord: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!text) return null;

  return (
    <div ref={ref} className="relative h-14 w-full">
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out ${
          inView ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: `${index * 1000}ms` }}
      >
        <h3 className="text-center text-xl font-medium leading-tight text-foreground dark:text-white md:text-2xl">
          {renderTextWithHighlight(text, highlightWord)}
        </h3>
      </div>
    </div>
  );
}

export function ValuePropositionSection({
  eyebrow,
  title,
  line1,
  line2,
  line3,
  buttons,
}: ValuePropositionSectionProps) {
  const hasContent = line1 || line2 || line3;

  if (!hasContent) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden bg-transparent py-16 md:py-20 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center text-center mb-10">
          {eyebrow && <Badge variant="secondary">{eyebrow}</Badge>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-1 text-center lg:text-left">
            {title && (
              <h2 className="text-balance font-semibold text-5xl leading-tight text-foreground md:text-6xl lg:text-7xl">
                {title}
              </h2>
            )}
          </div>

          <div className="order-2">
            <div className="flex flex-col gap-5">
              <SpotlightLine text={line1} highlightWord="real" index={0} />
              <SpotlightLine text={line2} highlightWord="real" index={1} />
              <SpotlightLine text={line3} highlightWord="real" index={2} />
            </div>

            {(buttons as any)?.length > 0 && (
              <div className="mt-8">
                <SanityButtons
                  buttons={buttons}
                  className="flex-col gap-4 sm:flex-row"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
