import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    // Selectors untuk berbagai elemen yang perlu reveal
    const revealElements = document.querySelectorAll(
      ".section-label, .section-heading, .hero-title, .hero-subtitle, " +
      ".ending-big, .ending-sub, .letter-wrap, .glow-btn, " +
      ".tl-item, .star-card, .gallery-item"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            
            // Reset animation
            el.style.animation = "none";
            el.offsetHeight; // Trigger reflow
            
            // Determine animation based on element type
            if (el.classList.contains("section-label")) {
              el.style.animation = "fadeInDown 0.6s ease-out forwards";
            } else if (el.classList.contains("section-heading")) {
              el.style.animation = "fadeInUp 0.8s ease-out 0.1s forwards";
            } else if (el.classList.contains("tl-item")) {
              el.style.animation = "fadeInUp 0.7s ease-out forwards";
            } else if (el.classList.contains("star-card")) {
              el.style.animation = "scaleInUp 0.6s ease-out forwards";
            } else if (el.classList.contains("gallery-item")) {
              el.style.animation = "scaleInUp 0.7s ease-out forwards";
            } else {
              el.style.animation = "fadeInUp 0.8s ease-out forwards";
            }
            
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      observer.observe(el);
    });

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
}