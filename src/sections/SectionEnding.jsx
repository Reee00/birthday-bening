import React, { useCallback, useState, useRef, useEffect } from "react";

export default function SectionEnding({ onShowToast, onSpawnSparks }) {
  const [celebrating, setCelebrating] = useState(false);
  const buttonRef = useRef(null);

  const handleCelebrate = useCallback(
    (e) => {
      if (celebrating) return;
      setCelebrating(true);

      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();

      // Create ripple
      const rip = document.createElement("span");
      rip.className = "ripple";
      rip.style.left = e.clientX - rect.left + "px";
      rip.style.top = e.clientY - rect.top + "px";
      btn.appendChild(rip);
      setTimeout(() => rip.remove(), 800);

      // Launch celebration
      launch();

      // Show toast
      if (onShowToast) {
        onShowToast("✦ Happy Birthday, My love ✦", 3500);
      }

      btn.disabled = true;
      setTimeout(() => {
        btn.disabled = false;
        setCelebrating(false);
      }, 4500);
    },
    [celebrating, onShowToast]
  );

  const launch = () => {
    const syms = ["❤", "✦", "✧", "♡", "◇", "✿", "★"];
    const cols = [
      "#ff6eb0",
      "#ffd77a",
      "#9b59d6",
      "#4fc3f7",
      "#fff0f5",
      "#c084fc",
    ];

    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const el = document.createElement("div");
        el.className = "celebrate-particle";
        const isSym = Math.random() > 0.4;
        el.textContent = isSym
          ? syms[Math.floor(Math.random() * syms.length)]
          : "";
        const c = cols[Math.floor(Math.random() * cols.length)];
        el.style.cssText = `left:${Math.random() * 100}vw;top:-20px;
          font-size:${8 + Math.random() * 20}px;color:${c};
          animation-duration:${2.5 + Math.random() * 3}s;
          animation-delay:${Math.random() * 0.6}s;
          ${
            !isSym
              ? `width:${4 + Math.random() * 8}px;height:${
                  4 + Math.random() * 8
                }px;background:${c};border-radius:${
                  Math.random() > 0.5 ? "50%" : "2px"
                };`
              : ""
          }`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 6000);
      }, Math.random() * 700);
    }
  };

  return (
    <section className="ending-section">
      <div className="section-divider"></div>
      <p className="ending-big">
        You are my
        <br />
        <em>favorite story</em>
      </p>
      <p className="ending-sub">
        This is only a small gift,
        <br />
        but my love for you stretches past every star.
      </p>
      <button
        ref={buttonRef}
        className="glow-btn"
        id="celebrateBtn"
        onClick={handleCelebrate}
        disabled={celebrating}
      >
        Celebrate With Me ✦
      </button>
    </section>
  );
}