import React, { useEffect, useRef } from "react";

export default function SectionHero({ onSpawnSparks }) {
  const sectionRef = useRef(null);
  const constellationCanvasRef = useRef(null);

  useEffect(() => {
    // Draw constellation on canvas
    const canvas = constellationCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const stars = [
  /* B - Diperbaiki koordinatnya agar lebih membulat */
  /* 0 */ {x:20,y:20}, /* 1 */ {x:20,y:45}, /* 2 */ {x:20,y:70}, // Batang kiri
  /* 3 */ {x:50,y:20}, /* 4 */ {x:65,y:32}, /* 5 */ {x:50,y:45}, // Perut atas
  /* 6 */ {x:65,y:58}, /* 7 */ {x:50,y:70},                     // Perut bawah

  /* E - (Sudah Bagus) */
  /* 8 */ {x:90,y:20}, {x:90,y:45}, {x:90,y:70},
  /* 11 */ {x:115,y:20}, {x:115,y:45}, {x:115,y:70},

  /* N - (Sudah Bagus) */
  /* 14 */ {x:140,y:70}, {x:140,y:20}, {x:170,y:70}, {x:170,y:20},

  /* I - (Sudah Bagus) */
  /* 18 */ {x:195,y:20}, {x:195,y:70},

  /* N - (Sudah Bagus) */
  /* 20 */ {x:220,y:70}, {x:220,y:20}, {x:250,y:70}, {x:250,y:20},

  /* G - Diperbaiki alurnya */
  /* 24 */ {x:280,y:35}, {x:305,y:20}, {x:330,y:35}, // Atas
  /* 27 */ {x:330,y:55}, {x:305,y:70}, {x:280,y:55}, // Bawah & Samping
  /* 30 */ {x:305,y:45}, {x:330,y:45}                // Lidah G (tengah)
];


    const connections = [
  /* B - Urutan garis diperbaiki agar menyambung */
  [0,1],[1,2],           // Batang kiri
  [0,3],[3,4],[4,5],[5,1], // Loop atas (Tutup ke tengah)
  [1,5],[5,6],[6,7],[7,2], // Loop bawah (Mulai dari tengah)

  /* E */
  [8,9],[9,10],[8,11],[9,12],[10,13],

  /* N */
  [14,15],[15,16],[16,17],

  /* I */
  [18,19],

  /* N */
  [20,21],[21,22],[22,23],

  /* G - Alur melingkar + garis tengah */
  [24,25],[25,26],         // Atas
  [26,27],                 // Samping kanan
  [27,28],                 // Bawah
  [28,29],                 // Samping kiri
  [29,24],                 // Tutup lingkaran atas
  [30,31]                  // Garis horizontal tengah (lidah G)
];

    // Resize canvas responsively
    const resizeCanvas = () => {
      const mw = Math.min(window.innerWidth - 40, 380);
      canvas.width = mw;
      canvas.height = Math.round((mw * 90) / 380);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let progress = 0;

    const drawConstellation = () => {
      const sx = canvas.width / 380;
      const sy = canvas.height / 90;
      const driftX = Math.sin(Date.now() * 0.0003) * 4;
      const driftY = Math.cos(Date.now() * 0.0002) * 2;
      const pts = stars.map((p) => ({
        x: p.x * sx + driftX,
        y: p.y * sy + driftY,
      }));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      progress = Math.min(progress + 0.006, 1);
      const edgeProgress = progress * connections.length;

      // Draw lines
      connections.forEach((e, i) => {
        const pr = Math.max(0, Math.min(1, edgeProgress - i));
        if (pr <= 0) return;

        const s = pts[e[0]];
        const en = pts[e[1]];
        const ex = s.x + (en.x - s.x) * pr;
        const ey = s.y + (en.y - s.y) * pr;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(ex, ey);

        ctx.strokeStyle = `rgba(255,160,210,${0.55 * pr})`;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255,150,220,0.7)";
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw stars
      const t = Date.now() * 0.002;
      pts.forEach((p, i) => {
        const appear = Math.min(1, progress * connections.length - i + 2);
        if (appear <= 0) return;

        const pulse = 0.7 + 0.3 * Math.sin(t + i * 0.8);
        const r = (1.8 + 1.1 * pulse) * Math.min(sx, sy) * 1.6;
        const alpha = appear * pulse;

        // Glow outer
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
        g.addColorStop(0, `rgba(255,150,220,${alpha * 0.45})`);
        g.addColorStop(1, "rgba(255,150,220,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2);
        ctx.fill();

        // Core white
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(drawConstellation);
    };

    setTimeout(() => requestAnimationFrame(drawConstellation), 900);

    // Handle tap/click for magic sparks
    const handleSectionClick = (e) => {
      if (onSpawnSparks) {
        onSpawnSparks(e.clientX, e.clientY, 8);
      }
    };

    const handleSectionTouch = (e) => {
      if (onSpawnSparks) {
        const touch = e.touches[0];
        onSpawnSparks(touch.clientX, touch.clientY, 10);
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("click", handleSectionClick);
      section.addEventListener("touchstart", handleSectionTouch, {
        passive: true,
      });
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (section) {
        section.removeEventListener("click", handleSectionClick);
        section.removeEventListener("touchstart", handleSectionTouch);
      }
    };
  }, [onSpawnSparks]);

  return (
    <section className="hero" id="heroSection" ref={sectionRef}>
      <div className="nebula-blob blob-1"></div>
      <div className="nebula-blob blob-2"></div>
      <div className="nebula-blob blob-3"></div>

      <div className="month-badge">February · A Universe Celebrates</div>

      <h1 className="hero-title">
        Happy Birthday,
        <br />
        <span className="line-italic">My Favorite Person</span>
      </h1>

      <div className="constellation-name">
        <canvas
          ref={constellationCanvasRef}
          id="constellationCanvas"
          width={380}
          height={90}
          aria-label="Decorative constellation"
        />
      </div>

      <div className="tap-hint" aria-hidden="true">
        <div className="tap-hint-dot"></div>
        <span>Tap anywhere for magic</span>
        <div className="tap-hint-dot"></div>
      </div>

      <p className="hero-subtitle">
        The universe took billions of years to arrange itself
        <br />
        just so you could exist. What a gift.
      </p>

      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}