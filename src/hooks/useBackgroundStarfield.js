import { useEffect, useRef } from "react";

export function useBackgroundStarfield() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    // Create canvas if not exists
    let canvas = document.getElementById("bgStarCanvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "bgStarCanvas";
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.zIndex = "-1";
      document.body.insertBefore(canvas, document.body.firstChild);
    }

    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d");

    const resizeBG = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = [...Array(120)].map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        s: Math.random() * 0.3 + 0.05,
      }));
    };

    resizeBG();

    const drawBG = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((st) => {
        st.y += st.s;
        if (st.y > canvas.height) st.y = 0;

        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fill();
      });

      requestAnimationFrame(drawBG);
    };

    drawBG();

    window.addEventListener("resize", resizeBG);

    return () => {
      window.removeEventListener("resize", resizeBG);
    };
  }, []);
}