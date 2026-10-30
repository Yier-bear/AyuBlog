"use client";

import { useEffect, useRef } from "react";

type StarParticle = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  gravity: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  color: string;
};

type Ripple = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
};

const STAR_COLORS = ["#f2a7bb", "#c9879e", "#9eb9c5", "#f5cf8e", "#fff7e8"];

export default function ClickEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const stars: StarParticle[] = [];
    const ripples: Ripple[] = [];
    let animationFrame = 0;

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };

    const drawStar = (star: StarParticle) => {
      context.save();
      context.translate(star.x, star.y);
      context.rotate(star.rotation);
      context.globalAlpha = Math.max(0, star.opacity);
      context.fillStyle = star.color;
      context.shadowBlur = 9;
      context.shadowColor = star.color;
      context.beginPath();

      for (let index = 0; index < 8; index += 1) {
        const angle = -Math.PI / 2 + index * Math.PI / 4;
        const radius = index % 2 === 0 ? star.size : star.size * 0.36;
        const pointX = Math.cos(angle) * radius;
        const pointY = Math.sin(angle) * radius;
        if (index === 0) context.moveTo(pointX, pointY);
        else context.lineTo(pointX, pointY);
      }

      context.closePath();
      context.fill();
      context.restore();
    };

    const handleClick = (event: MouseEvent) => {
      ripples.push({ x: event.clientX, y: event.clientY, radius: 3, opacity: 0.68 });

      const count = 10 + Math.floor(Math.random() * 5);
      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count + (Math.random() - 0.5) * 0.45;
        const speed = 1.4 + Math.random() * 3.1;
        stars.push({
          x: event.clientX + (Math.random() - 0.5) * 8,
          y: event.clientY + (Math.random() - 0.5) * 8,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed - (0.4 + Math.random() * 1.5),
          gravity: 0.045 + Math.random() * 0.035,
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.22,
          size: 3.5 + Math.random() * 4.8,
          opacity: 1,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
    };

    const animate = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index];
        ripple.radius += 3.2;
        ripple.opacity -= 0.03;
        context.save();
        context.globalAlpha = Math.max(0, ripple.opacity);
        context.strokeStyle = "#d695aa";
        context.lineWidth = 1.6;
        context.beginPath();
        context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        context.stroke();
        context.restore();
        if (ripple.opacity <= 0) ripples.splice(index, 1);
      }

      for (let index = stars.length - 1; index >= 0; index -= 1) {
        const star = stars[index];
        star.x += star.velocityX;
        star.y += star.velocityY;
        star.velocityY += star.gravity;
        star.velocityX *= 0.985;
        star.rotation += star.rotationSpeed;
        star.opacity -= 0.019;
        drawStar(star);
        if (star.opacity <= 0) stars.splice(index, 1);
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("click", handleClick, { passive: true });
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true" />;
}
