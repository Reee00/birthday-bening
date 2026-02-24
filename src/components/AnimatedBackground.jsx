import React, { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add CSS keyframes dynamically
    const style = document.createElement("style");
    style.textContent = `
      @keyframes floatDown {
        0% {
          transform: translateY(-100px) translateX(0) rotate(0deg);
          opacity: 0;
        }
        5% {
          opacity: 0.6;
        }
        95% {
          opacity: 0.4;
        }
        100% {
          transform: translateY(calc(100vh + 100px)) translateX(var(--tx, 0px)) rotate(360deg);
          opacity: 0;
        }
      }

      @keyframes floatBubble {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.3;
        }
        50% {
          transform: translate(calc(-50% + 30px), calc(-50% - 30px)) scale(1.1);
          opacity: 0.6;
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.3;
        }
      }

      @keyframes moveOrb {
        0% {
          transform: translate(-50%, -50%) scale(0.9);
          opacity: 0.2;
        }
        50% {
          transform: translate(calc(-50% + 40px), calc(-50% + 40px)) scale(1.1);
          opacity: 0.5;
        }
        100% {
          transform: translate(-50%, -50%) scale(0.9);
          opacity: 0.2;
        }
      }

      @keyframes glow {
        0%, 100% {
          filter: blur(40px);
          opacity: 0.3;
        }
        50% {
          filter: blur(50px);
          opacity: 0.5;
        }
      }
    `;
    document.head.appendChild(style);

    // Create particles dengan animation yang lebih smooth
    const createBackgroundParticles = () => {
      const particleCount = 100; // Dikurangi untuk lebih smooth
      const colors = [
        { r: 155, g: 89, b: 214 },   // purple
        { r: 255, g: 110, b: 176 },  // pink
        { r: 79, g: 195, b: 247 },   // blue
        { r: 255, g: 215, b: 122 },  // gold
      ];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        const size = Math.random() * 2 + 0.5;
        const duration = 30 + Math.random() * 50; // Lebih lama = lebih smooth
        const delay = Math.random() * duration;
        const x = Math.random() * 100;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const opacity = 0.1 + Math.random() * 0.3;
        const tx = (Math.random() - 0.5) * 200; // horizontal drift

        particle.style.cssText = `
          position: fixed;
          width: ${size}px;
          height: ${size}px;
          background: rgb(${color.r}, ${color.g}, ${color.b});
          border-radius: 50%;
          left: ${x}%;
          top: -20px;
          pointer-events: none;
          --tx: ${tx}px;
          box-shadow: 0 0 ${size * 3}px rgba(${color.r}, ${color.g}, ${color.b}, ${opacity});
          animation: floatDown ${duration}s linear ${delay}s infinite;
          will-change: transform;
        `;

        container.appendChild(particle);
      }
    };

    // Create nebulas yang moving smooth
    const createAnimatedNebulas = () => {
      const nebulas = [
        {
          color: "rgba(155, 89, 214, 0.2)",
          size: 400,
          startX: "15%",
          startY: "15%",
          duration: 40,
        },
        {
          color: "rgba(255, 110, 176, 0.15)",
          size: 350,
          startX: "75%",
          startY: "45%",
          duration: 50,
        },
        {
          color: "rgba(79, 195, 247, 0.12)",
          size: 380,
          startX: "45%",
          startY: "75%",
          duration: 60,
        },
        {
          color: "rgba(255, 215, 122, 0.1)",
          size: 300,
          startX: "25%",
          startY: "60%",
          duration: 55,
        },
      ];

      nebulas.forEach((nebula, idx) => {
        const blob = document.createElement("div");
        blob.style.cssText = `
          position: fixed;
          width: ${nebula.size}px;
          height: ${nebula.size}px;
          left: ${nebula.startX};
          top: ${nebula.startY};
          background: radial-gradient(circle, ${nebula.color}, transparent 70%);
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: floatBubble ${nebula.duration}s cubic-bezier(0.4, 0.0, 0.6, 1.0) infinite;
          will-change: transform;
          animation-delay: ${idx * 5}s;
        `;
        container.appendChild(blob);
      });
    };

    // Create glowing orbs dengan animation yang lebih halus
    const createGlowingOrbs = () => {
      const orbCount = 6; // Dikurangi dari 8
      const colors = ["#ff6eb0", "#9b59d6", "#4fc3f7", "#ffd77a"];

      for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement("div");
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 80 + Math.random() * 120;
        const x = Math.random() * 100;
        const y = 20 + Math.random() * 60;
        const duration = 20 + Math.random() * 30;
        const delay = Math.random() * 15;

        orb.style.cssText = `
          position: fixed;
          width: ${size}px;
          height: ${size}px;
          left: ${x}%;
          top: ${y}%;
          background: radial-gradient(circle at 30% 30%, ${color}44, transparent 70%);
          border-radius: 50%;
          filter: blur(50px);
          pointer-events: none;
          box-shadow: 0 0 ${size / 2}px ${color}88, inset -${size / 3}px -${size / 3}px ${size}px ${color}33;
          animation: moveOrb ${duration}s cubic-bezier(0.4, 0.0, 0.6, 1.0) ${delay}s infinite;
          will-change: transform;
        `;

        container.appendChild(orb);
      }
    };

    createBackgroundParticles();
    createAnimatedNebulas();
    createGlowingOrbs();

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    />
  );
}