import React, { useEffect, useRef } from "react";
import BirthdayCake from "./BirthdayCake";

export default function IntroOverlay({ onDismiss, onSpawnSparks }) {
  const overlayRef = useRef(null);
  const cakeWrapRef = useRef(null);

  useEffect(() => {
    // TEMPORARY: Uncomment bawah ini untuk clear intro seen
    // sessionStorage.removeItem("introSeen");

    // Render intro stars
    const starsEl = document.getElementById("introStars");
    if (starsEl && starsEl.children.length === 0) {
      for (let i = 0; i < 80; i++) {
        const s = document.createElement("div");
        s.className = "intro-star";
        const sz = 1 + Math.random() * 2.5;
        s.style.cssText = `
          width:${sz}px;height:${sz}px;
          top:${Math.random() * 100}%;left:${Math.random() * 100}%;
          animation-duration:${2 + Math.random() * 4}s;
          animation-delay:${Math.random() * 4}s;
        `;
        starsEl.appendChild(s);
      }
    }

    // Floating sparkles around cake
    const sparkSyms = ["✦", "✧", "♡", "◇", "★", "·"];
    const sparkColors = [
      "#ff6eb0",
      "#ffd77a",
      "#c084fc",
      "#4fc3f7",
      "#fff0f5",
    ];

    const cake = cakeWrapRef.current;
    if (cake && cake.querySelectorAll(".ck-sparkle").length === 0) {
      for (let i = 0; i < 8; i++) {
        const sp = document.createElement("div");
        sp.className = "ck-sparkle";
        const angle = (i / 8) * Math.PI * 2;
        const dist = 90 + Math.random() * 40;
        sp.style.cssText = `
          position: absolute;
          left:calc(50% + ${Math.cos(angle) * dist}px);
          top:calc(50% + ${Math.sin(angle) * dist}px);
          color:${sparkColors[i % sparkColors.length]};
          animation-duration:${2.5 + Math.random() * 2.5}s;
          animation-delay:${Math.random() * 2.5}s;
          font-size:${0.8 + Math.random() * 0.8}rem;
          pointer-events: none;
        `;
        sp.textContent = sparkSyms[i % sparkSyms.length];
        cake.appendChild(sp);
      }
    }

    document.body.style.overflow = "hidden";

    // ✅ FIX: Jangan skip intro - hapus check sessionStorage
    // Hapus block ini:
    // if (sessionStorage.getItem("introSeen")) {
    //   overlayRef.current.style.display = "none";
    //   document.body.style.overflow = "";
    // }

    // Selalu tampilkan intro
    sessionStorage.setItem("introSeen", "1");

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBlowCandles = () => {
    const btn = document.querySelector(".intro-btn");
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = "0.4";
    }

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate([20, 40, 80]);

    // Cake wobble
    const cakeWrap = cakeWrapRef.current;
    if (cakeWrap) {
      cakeWrap.style.animation = "none";
      cakeWrap.style.transition = "transform 0.15s ease";
      let wobbles = 0;
      const wobbleInterval = setInterval(() => {
        wobbles++;
        cakeWrap.style.transform =
          wobbles % 2 === 0
            ? "rotate(-2.5deg) scale(1.03)"
            : "rotate(2.5deg) scale(1.03)";
        if (wobbles >= 6) {
          clearInterval(wobbleInterval);
          cakeWrap.style.transform = "rotate(0deg) scale(1)";
        }
      }, 80);
    }

    // Blow particles
    blowParticles();

    // Dismiss overlay
    setTimeout(() => {
      if (overlayRef.current) {
        overlayRef.current.classList.add("exit");
        document.body.style.overflow = "";
        setTimeout(() => {
          overlayRef.current.style.display = "none";
          onDismiss();
        }, 1050);
      }
    }, 2200);
  };

  const blowParticles = () => {
    const syms = ["❤", "✦", "✧", "♡", "★", "◇", "✿", "·"];
    const colors = [
      "#ff6eb0",
      "#ffd77a",
      "#c084fc",
      "#4fc3f7",
      "#fff0f5",
      "#a78bfa",
    ];
    const svgElement = document.getElementById("cakeSvg");
    if (!svgElement) return;

    const svgRect = svgElement.getBoundingClientRect();
    const candleTips = [
      {
        x: svgRect.left + (svgRect.width * 86) / 220,
        y: svgRect.top + (svgRect.height * 14) / 220,
      },
      {
        x: svgRect.left + (svgRect.width * 101) / 220,
        y: svgRect.top + (svgRect.height * 10) / 220,
      },
      {
        x: svgRect.left + (svgRect.width * 110) / 220,
        y: svgRect.top + (svgRect.height * 8) / 220,
      },
      {
        x: svgRect.left + (svgRect.width * 126) / 220,
        y: svgRect.top + (svgRect.height * 10) / 220,
      },
      {
        x: svgRect.left + (svgRect.width * 134) / 220,
        y: svgRect.top + (svgRect.height * 14) / 220,
      },
    ];

    candleTips.forEach((tip, ci) => {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const p = document.createElement("div");
          p.className = "blow-p";
          const isSym = Math.random() > 0.45;
          const c = colors[Math.floor(Math.random() * colors.length)];
          p.textContent = isSym
            ? syms[Math.floor(Math.random() * syms.length)]
            : "";
          const spreadX = (Math.random() - 0.5) * 80;
          const startX = tip.x + (Math.random() - 0.5) * 20;
          p.style.cssText = `
            position: fixed;
            left:${startX}px;
            top:${tip.y}px;
            font-size:${10 + Math.random() * 14}px;
            color:${c};
            animation-duration:${2.5 + Math.random() * 2}s;
            animation-delay:0s;
            pointer-events: none;
            ${
              !isSym
                ? `width:${5 + Math.random() * 7}px;height:${
                    5 + Math.random() * 7
                  }px;background:${c};border-radius:${
                    Math.random() > 0.5 ? "50%" : "2px"
                  };`
                : ""
            }
          `;
          document.body.appendChild(p);
          setTimeout(() => p.remove(), 5000);
        }, ci * 80 + i * 40 + Math.random() * 200);
      }
    });
  };

  return (
    <div
      id="introOverlay"
      ref={overlayRef}
      className="intro-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Birthday intro"
    >
      <div className="intro-stars" id="introStars"></div>
      <div className="intro-nb inb1"></div>
      <div className="intro-nb inb2"></div>
      <div className="intro-nb inb3"></div>

      <div className="intro-label">A little surprise awaits you ✦</div>

      <div 
        className="cake-wrap" 
        ref={cakeWrapRef} 
        style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <BirthdayCake onBlown={handleBlowCandles} />
      </div>

      <h1 className="intro-title">
        Happy Birthday,<br />
        <em>my love</em>
      </h1>
      <p className="intro-sub">Blow out the candles and make a wish ✦</p>
      <button
        className="intro-btn"
        id="introBtn"
        aria-label="Blow out the candles"
        onClick={handleBlowCandles}
      >
        💨 &nbsp; Blow the Candles
      </button>
    </div>
  );
}