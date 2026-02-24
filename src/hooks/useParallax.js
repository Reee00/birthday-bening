import { useEffect } from "react";

export function useParallax() {
  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const sy = window.scrollY;

        // Blob parallax
        document.querySelectorAll(".nebula-blob").forEach((b, i) => {
          b.style.transform = `translateY(${sy * (0.1 + i * 0.05)}px)`;
        });

        // Section headings subtle lift
        document.querySelectorAll(".section-heading.visible").forEach((h) => {
          const rect = h.getBoundingClientRect();
          const pct = (window.innerHeight / 2 - rect.top) / window.innerHeight;
          h.style.transform = `translateY(${pct * -12}px)`;
        });

        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
}