'use client';
import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(InertiaPlugin);

type DotGridProps = {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  shockRadius?: number;
  shockStrength?: number;
  resistance?: number;
  returnDuration?: number;
};

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 2,
  gap = 20,
  baseColor = '#333333',
  activeColor = '#ffffff',
  proximity = 100,
  shockRadius = 200,
  shockStrength = 3,
  resistance = 500,
  returnDuration = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRefs = useRef<gsap.core.Tween[]>([]);
  const size = useMemo(() => dotSize + gap, [dotSize, gap]);

  const createDotAnimation = useCallback(
    (dot: { x: number; y: number; element?: any }, index: number) => {
      const tween = gsap.to(dot, {
        duration: returnDuration,
        x: dot.x,
        y: dot.y,
        ease: 'elastic.out(1, 0.3)',
        paused: true,
      });
      dotRefs.current[index] = tween;
      return tween;
    },
    [returnDuration]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const cols = Math.floor(width / size) + 1;
    const rows = Math.floor(height / size) + 1;

    const dots = Array.from({ length: cols * rows }, (_, i) => {
      const x = (i % cols) * size;
      const y = Math.floor(i / cols) * size;
      const original = { x, y };
      const dot = { x, y, original, tween: null as gsap.core.Tween | null };
      dot.tween = createDotAnimation(dot, i);
      return dot;
    });

    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleClick = () => {
      dots.forEach(dot => {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < shockRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - distance / shockRadius) * shockStrength;
          gsap.to(dot, {
            x: dot.x + Math.cos(angle) * shockRadius * force * 0.1,
            y: dot.y + Math.sin(angle) * shockRadius * force * 0.1,
            duration: 0.1,
            onComplete: () => dot.tween?.play(),
          });
        }
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      dots.forEach(dot => {
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let targetX = dot.original.x;
        let targetY = dot.original.y;

        if (distance < proximity) {
          const angle = Math.atan2(dy, dx);
          const force = (proximity - distance) / proximity;
          targetX -= Math.cos(angle) * force * (dotSize * 2);
          targetY -= Math.sin(angle) * force * (dotSize * 2);
        }
        
        dot.x += (targetX - dot.x) * 0.1;
        dot.y += (targetY - dot.y) * 0.1;

        const scale = 1 + (1 - Math.min(distance, proximity) / proximity) * 1.5;
        const opacity = 0.5 + (1 - Math.min(distance, proximity) / proximity) * 0.5;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize * scale * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = distance < proximity ? activeColor : baseColor;
        ctx.globalAlpha = opacity;
        ctx.fill();
      });

      requestAnimationFrame(render);
    };

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        // Re-init dots array on resize could be added here if needed
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      dotRefs.current.forEach(tween => tween?.kill());
    };
  }, [size, baseColor, activeColor, proximity, shockRadius, shockStrength, dotSize, createDotAnimation]);

  return <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />;
};

export default DotGrid;
