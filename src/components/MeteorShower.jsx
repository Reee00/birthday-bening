import React, { useEffect, useRef } from "react";

export default function MeteorShower() {
  const containRef = useRef(null);

  useEffect(() => {
    const container = containRef.current;
    if (!container) return;

    const createMeteor = () => {
      const meteor = document.createElement("div");
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight * 0.4;
      const size = 1 + Math.random() * 2;
      const duration = 2 + Math.random() * 2;
      const color = ["#ff6eb0", "#ffd77a", "#c084fc", "#4fc3f7"][
        Math.floor(Math.random() * 4)
      ];

      meteor.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, ${color}, transparent);
        border-radius: 50%;
        box-shadow: 
          0 0 ${size * 3}px ${color},
          0 0 ${size * 6}px rgba(255,110,176,0.3);
        pointer-events: none;
        z-index: 1;
        filter: blur(0.5px);
      `;

      container.appendChild(meteor);

      // Animated trail
      const trail = document.createElement("div");
      trail.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        width: 1px;
        height: ${40 + Math.random() * 60}px;
        background: linear-gradient(to bottom, ${color}, transparent);
        pointer-events: none;
        z-index: 1;
        filter: blur(1px);
        opacity: 0.6;
      `;
      container.appendChild(trail);

      // Animate meteor + trail
      const endX = startX + (Math.random() - 0.5) * 200;
      const endY = startY + 300 + Math.random() * 200;

      meteor.animate(
        [
          {
            left: startX + "px",
            top: startY + "px",
            opacity: 1,
            filter: "blur(0.5px)",
          },
          {
            left: startX + (endX - startX) * 0.5 + "px",
            top: startY + (endY - startY) * 0.7 + "px",
            opacity: 0.8,
            filter: "blur(0.8px)",
            offset: 0.7,
          },
          {
            left: endX + "px",
            top: endY + "px",
            opacity: 0,
            filter: "blur(2px)",
          },
        ],
        {
          duration: duration * 1000,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }
      );

      trail.animate(
        [
          {
            left: startX + "px",
            top: startY + "px",
            opacity: 0.8,
          },
          {
            left: startX + (endX - startX) * 0.5 + "px",
            top: startY + (endY - startY) * 0.7 + "px",
            opacity: 0.4,
            offset: 0.7,
          },
          {
            left: endX + "px",
            top: endY + "px",
            opacity: 0,
          },
        ],
        {
          duration: duration * 1000,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }
      );

      // Cleanup
      setTimeout(() => {
        meteor.remove();
        trail.remove();
      }, duration * 1000 + 100);
    };

    // Create meteors periodically
    const meteorInterval = setInterval(() => {
      if (Math.random() < 0.6) {
        createMeteor();
      }
    }, 3000 + Math.random() * 3000); // Random interval 3-6 detik

    return () => {
      clearInterval(meteorInterval);
    };
  }, []);

  return (
    <div
      ref={containRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}