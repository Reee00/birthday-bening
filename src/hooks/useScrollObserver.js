import { useEffect } from "react";

export function useScrollObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll(
      ".section-label,.section-heading,.tl-item,.letter-wrap,.ending-big,.ending-sub,.glow-btn,.stars-progress-wrap,.section-divider,.reveal-up,.reveal-zoom,.gallery-item"
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
}