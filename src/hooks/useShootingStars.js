import { useEffect } from "react";

export function useShootingStars() {
  useEffect(() => {
    const createShootingStar = () => {
      const x = Math.random() * window.innerWidth * 0.7;
      const y = Math.random() * window.innerHeight * 0.3;

      const star = document.createElement("div");
      const size = 2 + Math.random() * 2;
      
      star.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: white;
        box-shadow: 
          0 0 ${size * 2}px #fff,
          0 0 ${size * 4}px rgba(255,110,176,0.6);
        border-radius: 50%;
        transform: rotate(45deg);
        z-index: 1;
        opacity: 1;
        pointer-events: none;
        will-change: transform;
      `;
      document.body.appendChild(star);

      const len = 120 + Math.random() * 100;
      const duration = 1200 + Math.random() * 600;
      
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const x = progress * len;
        const y = progress * len;
        const opacity = Math.max(0, 1 - progress);
        
        star.style.transform = `translate(${x}px, ${y}px) rotate(45deg)`;
        star.style.opacity = opacity;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          star.remove();
        }
      };
      
      requestAnimationFrame(animate);
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.6) {
        createShootingStar();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);
}