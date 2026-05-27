"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";
import { RichText } from "../elements/rich-text";
import { SanityButtons } from "../elements/sanity-buttons";

type HeroBlockProps = PagebuilderType<"hero"> & {
  title?: string;
  badge?: string;
  richText?: unknown[];
  buttons?: unknown[];
  video?: {
    asset?: {
      url?: string;
    };
  };
};

function splitHeroTitle(title?: string) {
  if (!title) {
    return { topLine: "", bottomLine: "" };
  }

  if (title.includes("|")) {
    const [topLine, bottomLine] = title.split("|");
    return {
      topLine: topLine?.trim() ?? "",
      bottomLine: bottomLine?.trim() ?? "",
    };
  }

  if (title.includes("\n")) {
    const [topLine, bottomLine] = title.split("\n");
    return {
      topLine: topLine?.trim() ?? "",
      bottomLine: bottomLine?.trim() ?? "",
    };
  }

  return {
    topLine: title,
    bottomLine: "",
  };
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulsePhase: number;
}

export function HeroBlock({
  title,
  buttons,
  badge,
  richText,
  video,
}: HeroBlockProps) {
  const { topLine, bottomLine } = splitHeroTitle(title);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);
  const [rippleTriggered, setRippleTriggered] = useState(false);
  const [anchorGlow, setAnchorGlow] = useState(false);
  const rippleRef = useRef<HTMLDivElement>(null);

  const triggerRipple = useCallback(() => {
    if (rippleTriggered) return;

    setRippleTriggered(true);

    if (rippleRef.current) {
      rippleRef.current.classList.add("animate");
    }

    setTimeout(() => {
      setAnchorGlow(true);
      setTimeout(() => setAnchorGlow(false), 800);
    }, 1000);
  }, [rippleTriggered]);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 20000));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.4 + 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    particlesRef.current = particles;
  }, []);

  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const isDark = document.documentElement.classList.contains("dark");
    const baseColor = isDark ? 160 : 80;

    const width = canvas.width;
    const height = canvas.height;
    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle, i) => {
      const dxMouse = mouse.x - particle.x;
      const dyMouse = mouse.y - particle.y;
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      let attractX = 0;
      let attractY = 0;
      const attractStrength = 0.02;

      if (distMouse < 300 && distMouse > 0) {
        const force = (300 - distMouse) / 300;
        attractX = (dxMouse / distMouse) * force * attractStrength * 2;
        attractY = (dyMouse / distMouse) * force * attractStrength * 2;
      }

      particle.vx += attractX;
      particle.vy += attractY;
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      particle.vx += (Math.random() - 0.5) * 0.05;
      particle.vy += (Math.random() - 0.5) * 0.05;

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      particle.pulsePhase += 0.03;
      const pulse = Math.sin(particle.pulsePhase) * 0.3 + 0.7;

      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        if (!other) continue;
        
        const dx = other.x - particle.x;
        const dy = other.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.25 * pulse;
          
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(${baseColor}, ${baseColor}, ${baseColor}, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      const size = particle.size * (1 + pulse * 0.1);
      
      ctx.save();
      ctx.translate(particle.x, particle.y);
      
      const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3);
      outerGlow.addColorStop(0, `rgba(${baseColor}, ${baseColor}, ${baseColor}, ${particle.opacity * pulse * 0.3})`);
      outerGlow.addColorStop(1, `rgba(${baseColor}, ${baseColor}, ${baseColor}, 0)`);
      ctx.beginPath();
      ctx.arc(0, 0, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = outerGlow;
      ctx.fill();
      
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const angle = (h / 6) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * size;
        const y = Math.sin(angle) * size;
        if (h === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${baseColor}, ${baseColor}, ${baseColor}, ${particle.opacity * pulse * 0.5})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${baseColor}, ${baseColor}, ${baseColor}, ${particle.opacity * pulse})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const angle = (h / 6) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * size * 0.5;
        const y = Math.sin(angle) * size * 0.5;
        if (h === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${baseColor}, ${baseColor}, ${baseColor}, ${particle.opacity * pulse * 0.7})`;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * pulse * 0.8})`;
      ctx.fill();
      
      ctx.restore();
    });

    if (mouse.x !== 0 || mouse.y !== 0) {
      const grad = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 200
      );
      grad.addColorStop(0, `rgba(${baseColor}, ${baseColor}, ${baseColor}, 0.2)`);
      grad.addColorStop(0.5, `rgba(${baseColor}, ${baseColor}, ${baseColor}, 0.08)`);
      grad.addColorStop(1, `rgba(${baseColor}, ${baseColor}, ${baseColor}, 0)`);

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 200, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(drawParticles);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: 0, y: 0 };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    drawParticles();

    const timer = setTimeout(() => {
      triggerRipple();
    }, 500);

    return () => {
      window.removeEventListener("resize", handleResize);
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
      clearTimeout(timer);
    };
  }, [drawParticles, initParticles, triggerRipple]);

  return (
<section
  ref={sectionRef}
  className="relative min-h-screen overflow-hidden"
  id="hero"
>
  {video?.asset?.url && (
    <video
      src={video.asset.url}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover z-0 opacity-30"
    />
  )}

  <canvas
    ref={canvasRef}
    className="absolute inset-0"
    style={{ pointerEvents: "none" }}
  />

      <div className="hero-tech-bg absolute inset-0" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 md:px-12">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <div className="hero-text-fade hero-text-fade-1">
            {badge && <Badge variant="secondary">{badge}</Badge>}
          </div>

          <div className="mt-12 max-w-4xl space-y-8 md:mt-16">
            <h1 className="text-balance text-5xl font-semibold leading-[0.92] tracking-tight md:text-6xl lg:text-7xl">
              <span className="hero-text-fade hero-text-fade-1 block mb-4 md:mb-6">
                {topLine}
              </span>

              {bottomLine && (
                <span
                  className={`hero-text-fade hero-text-fade-2 hero-anchor block ${
                    anchorGlow ? "ripple-hit" : ""
                  }`}
                >
                  {bottomLine}
                </span>
              )}
            </h1>

            <div className="hero-text-fade hero-text-fade-3">
              <RichText
                className="mx-auto max-w-xl text-base md:text-lg"
                richText={richText}
              />
            </div>

            <div className="hero-text-fade hero-text-fade-4 hero-buttons">
              <SanityButtons
                buttonClassName="w-full sm:w-auto"
                buttons={buttons}
                className="mt-10 grid w-full max-w-sm gap-4 sm:w-fit sm:grid-flow-col"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hero-ripple" ref={rippleRef} />
    </section>
  );
}
