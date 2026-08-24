'use client';

import { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from '@/lib/hooks';
import { seededRandom } from '@/lib/utils';

type Node = { x: number; y: number; vx: number; vy: number; r: number };

/**
 * Ambient "code + data" field: a sparse network of drifting nodes with
 * proximity links, plus one very faint chart curve running underneath.
 *
 * Performance notes
 *  - single canvas, no DOM nodes, transforms only
 *  - node count scales with viewport area and is capped
 *  - the RAF loop stops when the hero leaves the viewport or the tab is hidden
 *  - reduced motion renders one static frame and never starts the loop
 */
export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let frame = 0;
    let running = false;
    let t = 0;

    const LINK_DISTANCE = 132;
    const ACCENT = '53,199,154';

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.round((width * height) / 26000);
      const count = Math.max(18, Math.min(density, 64));

      nodes = Array.from({ length: count }, (_, i) => ({
        x: seededRandom(i + 1) * width,
        y: seededRandom(i + 101) * height,
        vx: (seededRandom(i + 201) - 0.5) * 0.14,
        vy: (seededRandom(i + 301) - 0.5) * 0.14,
        r: 0.8 + seededRandom(i + 401) * 1.2,
      }));
    };

    /** Faint analytics curve; `phase` animates it when motion is allowed. */
    const drawCurve = (phase: number) => {
      const baseline = height * 0.72;
      const amplitude = Math.min(height * 0.12, 90);

      ctx.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const n = x / width;
        const y =
          baseline -
          Math.sin(n * Math.PI * 2.2 + phase) * amplitude * (0.35 + n * 0.5) -
          Math.sin(n * Math.PI * 5.5 + phase * 0.6) * amplitude * 0.16;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${ACCENT},0.13)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Soft fill under the curve keeps it reading as a chart, not a wave.
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const gradient = ctx.createLinearGradient(0, baseline - amplitude, 0, height);
      gradient.addColorStop(0, `rgba(${ACCENT},0.055)`);
      gradient.addColorStop(1, 'rgba(53,199,154,0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      drawCurve(t);

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;
      }

      // Proximity links. O(n^2) is fine at <= 64 nodes.
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DISTANCE) continue;
          const alpha = (1 - dist / LINK_DISTANCE) * 0.16;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT},0.42)`;
        ctx.fill();
      }
    };

    const loop = () => {
      t += 0.0035;
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    build();
    draw();

    if (!reduced) start();

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    observer.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        draw();
      }, 160);
    };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
    };
  }, [reduced]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Structural grid */}
      <div className="absolute inset-0 grid-bg opacity-[0.55] [mask-image:radial-gradient(75%_60%_at_50%_35%,#000,transparent)]" />
      {/* Node + curve field */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Accent bloom */}
      <div className="absolute left-1/2 top-[-18%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(53,199,154,0.10),transparent)] blur-[2px]" />
      <div className="absolute bottom-[-30%] right-[-10%] h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(224,164,88,0.055),transparent)]" />
      {/* Bottom fade into the page */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
    </div>
  );
}
