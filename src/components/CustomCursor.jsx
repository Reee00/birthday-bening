import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(hover:none)").matches;
    if (isTouch) return; // Skip on mobile

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx - 4 + "px";
        cursorRef.current.style.top = my - 4 + "px";
      }
    });

    function animate() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = rx - 16 + "px";
        cursorRingRef.current.style.top = ry - 16 + "px";
      }
      requestAnimationFrame(animate);
    }
    animate();

    // Cursor scale on hover
    const interactiveEls = document.querySelectorAll(
      "button,.star-card,.tl-card"
    );
    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (cursorRef.current)
          cursorRef.current.style.transform = "scale(2.5)";
      });
      el.addEventListener("mouseleave", () => {
        if (cursorRef.current)
          cursorRef.current.style.transform = "scale(1)";
      });
    });
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        id="cursor"
        style={{
          position: "fixed",
          width: "8px",
          height: "8px",
          background: "var(--glow-pink)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 10000,
          mixBlendMode: "screen",
          boxShadow:
            "0 0 10px var(--glow-pink), 0 0 30px rgba(255,110,176,0.4)",
        }}
      />
      <div
        ref={cursorRingRef}
        id="cursorRing"
        style={{
          position: "fixed",
          width: "32px",
          height: "32px",
          border: "1px solid rgba(255,110,176,0.4)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  );
}