import React, { useEffect, useRef, memo } from "react";

const StarCanvas = memo(function StarCanvas({ scrollY }) {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const layersRef = useRef([
    { count: 250, speed: 0.015, minR: 0.2, maxR: 0.5, alpha: 0.3, pulse: true },
    { count: 150, speed: 0.04, minR: 0.6, maxR: 1.0, alpha: 0.5, pulse: true },
    { count: 50, speed: 0.08, minR: 1.0, maxR: 1.8, alpha: 0.8, pulse: false },
  ]);
  const parallaxRef = useRef({ x: 0, y: 0 });
  const touchRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    parallaxRef.current = { x: W / 2, y: H / 2 };

    // Use requestAnimationFrame untuk lebih smooth
    let animationTime = 0;

    // Initialize stars sekali saja
    if (starsRef.current.length === 0) {
      layersRef.current.forEach((layer) => {
        for (let i = 0; i < layer.count; i++) {
          starsRef.current.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: layer.minR + Math.random() * (layer.maxR - layer.minR),
            baseAlpha: layer.alpha * (0.5 + Math.random() * 0.5),
            to: Math.random() * Math.PI * 2,
            ts: 0.005 + Math.random() * 0.015,
            speed: layer.speed,
            glow: Math.random() < 0.15,
            pulse: layer.pulse,
            pulseSpeed: 0.008 + Math.random() * 0.012,
          });
        }
      });
    }

    const drawStars = () => {
      animationTime += 1;

      // Clear with semi-transparency untuk motion blur effect
      ctx.fillStyle = "#030510";
      ctx.fillRect(0, 0, W, H);

      // Smooth gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, W, H);
      bgGradient.addColorStop(0, "#0a0515");
      bgGradient.addColorStop(0.5, "#060b1f");
      bgGradient.addColorStop(1, "#030510");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, W, H);

      // 🌌 NEBULAS - Smooth animation
      const nebulas = [
        {
          x: W * 0.2,
          y: H * 0.25,
          r: 280,
          color: [155, 89, 214],
          alpha: 0.12,
        },
        {
          x: W * 0.75,
          y: H * 0.55,
          r: 320,
          color: [255, 110, 176],
          alpha: 0.1,
        },
        {
          x: W * 0.45,
          y: H * 0.8,
          r: 240,
          color: [79, 195, 247],
          alpha: 0.08,
        },
      ];

      nebulas.forEach((neb) => {
        const g = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.r);
        g.addColorStop(0, `rgba(${neb.color},${neb.alpha})`);
        g.addColorStop(0.4, `rgba(${neb.color},${neb.alpha * 0.3})`);
        g.addColorStop(1, `rgba(${neb.color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const isTouch = window.matchMedia("(hover:none)").matches;
      const usePX = isTouch ? touchRef.current.x : parallaxRef.current.x;
      const usePY = isTouch ? touchRef.current.y : parallaxRef.current.y;

      // Draw stars dengan smooth animation
      starsRef.current.forEach((s) => {
        const ox = (usePX / W - 0.5) * s.speed * 80;
        const oy = (usePY / H - 0.5) * s.speed * 80 - scrollY * s.speed * 0.3;
        
        // Smooth twinkling
        const tw = 0.5 + 0.5 * Math.sin(animationTime * s.ts + s.to);
        let a = s.baseAlpha * (0.5 + 0.5 * tw);

        // Pulse untuk bintang tertentu
        if (s.pulse) {
          const pulse = 0.7 + 0.3 * Math.sin(animationTime * s.pulseSpeed);
          a *= pulse;
        }

        const sx = s.x + ox;
        const sy = s.y + oy;

        if (s.glow) {
          // Bintang dengan glow
          const glowSize = s.r * 5 * (0.8 + 0.2 * tw);
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowSize);
          g.addColorStop(0, `rgba(255,110,176,${a * 0.7})`);
          g.addColorStop(0.5, `rgba(255,110,176,${a * 0.2})`);
          g.addColorStop(1, "rgba(255,110,176,0)");

          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(sx, sy, glowSize, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath();
          ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Regular star
          ctx.fillStyle = `rgba(240,244,255,${a})`;
          ctx.beginPath();
          ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(drawStars);
    };

    drawStars();

    // Event listeners
    const handleMouseMove = (e) => {
      parallaxRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e) => {
      if (e.touches[0]) {
        touchRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollY]);

  return (
    <canvas
      ref={canvasRef}
      id="starCanvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
});

export default StarCanvas;