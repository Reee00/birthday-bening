import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import IntroOverlay from "./components/IntroOverlay";
import AnimatedBackground from "./components/AnimatedBackground";
import StarCanvas from "./components/StarCanvas";
import MeteorShower from "./components/MeteorShower";
import CustomCursor from "./components/CustomCursor";
import MusicPlayer from "./components/MusicPlayer";
import Toast from "./components/Toast";
import SectionHero from "./sections/SectionHero";
import SectionTimeline from "./sections/SectionTimeline";
import SectionStars from "./sections/SectionStars";
import SectionLetter from "./sections/SectionLetter";
import SectionGallery from "./sections/SectionGallery";
import SectionEnding from "./sections/SectionEnding";
import { useScrollObserver } from "./hooks/useScrollObserver";
import { useParallax } from "./hooks/useParallax";
import { useShootingStars } from "./hooks/useShootingStars";
import { useScrollReveal } from "./hooks/useScrollReveal";

// Particle Pool untuk sparks (reuse element, jangan terus create-destroy)
class ParticlePool {
  constructor(maxSize = 200) {
    this.maxSize = maxSize;
    this.particles = [];
    this.activeParticles = [];
  }

  spawn(x, y, count = 8) {
    const newParticles = [];
    const sparkSyms = ["✦", "♡", "✧", "·", "◇", "★", "✿", "❤"];

    for (let i = 0; i < count && this.activeParticles.length < this.maxSize; i++) {
      const angle = (Math.PI * 2) / count * i + Math.random() * 0.5;
      const dist = 50 + Math.random() * 90;

      newParticles.push({
        id: Math.random(),
        x,
        y,
        icon: sparkSyms[Math.floor(Math.random() * sparkSyms.length)],
        color: `hsl(${320 + Math.random() * 60}, 80%, 75%)`,
        fontSize: 10 + Math.random() * 16,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        tr: -180 + Math.random() * 360,
        duration: 0.7 + Math.random() * 0.6,
        delay: Math.random() * 0.08,
        createdAt: Date.now(),
      });
    }

    this.activeParticles.push(...newParticles);
    return newParticles;
  }

  cleanup() {
    const now = Date.now();
    this.activeParticles = this.activeParticles.filter((p) => {
      return now - p.createdAt < p.duration * 1000 + p.delay * 1000;
    });
  }

  getActive() {
    this.cleanup();
    return this.activeParticles;
  }
}

// Spark Particle Component
const Spark = React.memo(({ particle }) => {
  const elapsedTime = Date.now() - particle.createdAt;
  const totalDuration = (particle.duration + particle.delay) * 1000;
  const progress = Math.min(elapsedTime / totalDuration, 1);

  const opacity = Math.max(0, 1 - progress);
  const scale = 1 - progress * 0.7;
  const rotation = progress * 360;

  return (
    <div
      style={{
        position: "fixed",
        left: particle.x + "px",
        top: particle.y + "px",
        pointerEvents: "none",
        zIndex: 9999,
        opacity,
        transform: `translate(${particle.tx * progress}px, ${
          particle.ty * progress
        }px) scale(${scale}) rotate(${rotation}deg)`,
        fontSize: particle.fontSize + "px",
        color: particle.color,
        transition: "none",
      }}
    >
      {particle.icon}
    </div>
  );
});

Spark.displayName = "Spark";

export default function CinematicBirthdayExperience() {
  const [showIntro, setShowIntro] = useState(true);
  const [toast, setToast] = useState({ message: "", show: false });
  const [scrollY, setScrollY] = useState(0);
  const [sparkParticles, setSparkParticles] = useState([]);
  const particlePoolRef = useRef(new ParticlePool(200));
  const animationLoopRef = useRef(null);

  // Initialize hooks (optimized)
  useScrollObserver();
  useParallax();
  useShootingStars();
  useScrollReveal();

  // Particle update loop (single RAF loop untuk semua particles)
  useEffect(() => {
    let frameId;

    const updateParticles = () => {
      particlePoolRef.current.cleanup();
      setSparkParticles(particlePoolRef.current.getActive());
      frameId = requestAnimationFrame(updateParticles);
    };

    frameId = requestAnimationFrame(updateParticles);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  // Handle scroll (throttled)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dismiss intro overlay
  const handleDismissIntro = useCallback(() => {
    setShowIntro(false);
    document.body.style.overflow = "";
  }, []);

  // Show toast
  const showToastMessage = useCallback((message, duration = 2500) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), duration);
  }, []);

  // Spawn sparks (optimized - menggunakan pool)
  const spawnSparks = useCallback((x, y, count = 8) => {
    const newParticles = particlePoolRef.current.spawn(x, y, count);
    // Update immediately
    setSparkParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Memoize sections untuk menghindari re-render tidak perlu
  const sections = useMemo(
    () => [
      <SectionHero key="hero" onSpawnSparks={spawnSparks} />,
      <SectionTimeline key="timeline" />,
      <SectionStars
        key="stars"
        onSpawnSparks={spawnSparks}
        onShowToast={showToastMessage}
      />,
      <SectionLetter key="letter" />,
      <SectionGallery key="gallery" />,
      <SectionEnding
        key="ending"
        onSpawnSparks={spawnSparks}
        onShowToast={showToastMessage}
      />,
    ],
    [spawnSparks, showToastMessage]
  );

  return (
    <div className="cinematic-birthday-container">
      {/* ✨ Intro Overlay */}
      {showIntro && (
        <IntroOverlay
          onDismiss={handleDismissIntro}
          onSpawnSparks={spawnSparks}
        />
      )}

{/*🌌 BACKGROUND LAYERS*/ }
      <AnimatedBackground scrollY={scrollY} /> {/* ✅ ADD - paling bawah */}
      <StarCanvas scrollY={scrollY} />
      <MeteorShower />

      {/* 🎨 Global UI Elements */}
      <StarCanvas scrollY={scrollY} />
      <MeteorShower />      
      <CustomCursor />
      <Toast message={toast.message} show={toast.show} />
      <MusicPlayer />

      {/* Spark Particles Container */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        {sparkParticles.map((particle) => (
          <Spark key={particle.id} particle={particle} />
        ))}
      </div>

      {/* 🖼️ Lightbox Modal */}
      <div id="lightbox" className="lightbox">
        <button
          id="lightboxClose"
          className="lightbox-close"
          aria-label="Close lightbox"
          onClick={() => {
            const lb = document.getElementById("lightbox");
            if (lb) lb.classList.remove("open");
          }}
        >
          ✕
        </button>
        <img id="lightboxImg" src="" alt="" className="lightbox-img" />
        <div id="lightboxCaption" className="lightbox-caption"></div>
      </div>

      {/* 📖 Main Content */}
      <div className="page">{sections}</div>
    </div>
  );
}