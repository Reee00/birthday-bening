import React, { useState, useEffect, useRef } from "react";

const timelineItems = [
  {
    date: "✦ The Beginning",
    title: "The Day We Met",
    text: "I still remember the exact moment I first saw you. Time seemed to slow down, and somehow I knew that my life was about to change forever. You smiled, and I was completely, hopelessly drawn to you.",
    side: "left",
  },
  {
    date: "✦ A Perfect Evening",
    title: "Our First Date",
    text: "We talked for hours like we'd known each other for years. Your laugh became my favorite sound. Walking you home that night, I didn't want the evening to end. I already knew I wanted more nights just like this.",
    side: "right",
  },
  {
    date: "✦ A Turning Point",
    title: "When Everything Changed",
    text: "Do you remember that rainy evening when we got completely soaked? We laughed until we cried, and in that moment I realized I was falling in love — not just with who you are, but the way you make every moment feel magical.",
    side: "left",
  },
  {
    date: "✦ Right Now",
    title: "Today and Every Day",
    text: "Here we are, celebrating you. Every day with you is a gift I never take for granted. You've made my life fuller, brighter, and infinitely better. This is just one chapter in our story, and I can't wait to write the rest with you.",
    side: "right",
  },
];

export default function SectionTimeline() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeSwipeIdx, setActiveSwipeIdx] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile || !trackRef.current) return;

    const track = trackRef.current;
    const handleScroll = () => {
      const cw = track.querySelector(".tl-item")?.offsetWidth + 16 || 0;
      const idx = Math.round(track.scrollLeft / cw);
      setActiveSwipeIdx(idx);
    };

    track.addEventListener("scroll", handleScroll, { passive: true });

    // Touch highlight
    const items = track.querySelectorAll(".tl-item");
    items.forEach((item) => {
      item.addEventListener("touchstart", () =>
        item.classList.add("touched"),
        { passive: true }
      );
      item.addEventListener("touchend", () => {
        setTimeout(() => item.classList.remove("touched"), 700);
      });
    });

    return () => {
      track.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <section className="timeline-section">
        <div className="section-divider"></div>
        <div className="section-label" style={{ marginTop: "1.5rem" }}>
          Our universe expanding
        </div>
        <h2 className="section-heading">
          Written in the <em>Stars</em>
        </h2>
        <div className="swipe-guide" aria-hidden="true">
          <span>←</span>
          <span>Swipe to explore</span>
          <span>→</span>
        </div>
        <div className="timeline-wrap">
          <div className="tl-track" ref={trackRef}>
            {timelineItems.map((item, idx) => (
              <div className="tl-item" key={idx}>
                <div className="tl-card">
                  <div className="tl-date">{item.date}</div>
                  <div className="tl-title">{item.title}</div>
                  <p className="tl-text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="swipe-dots">
          {timelineItems.map((_, idx) => (
            <div
              key={idx}
              className={`swipe-dot${idx === activeSwipeIdx ? " active" : ""}`}
            />
          ))}
        </div>
      </section>
    );
  }

  // Desktop layout
  return (
    <section className="timeline-section">
      <div className="section-divider"></div>
      <div className="section-label" style={{ marginTop: "1.5rem" }}>
        Our universe expanding
      </div>
      <h2 className="section-heading">
        Written in the <em>Stars</em>
      </h2>
      <div className="timeline-wrap">
        {timelineItems.map((item, idx) => (
          <div className="tl-item" key={idx}>
            {item.side === "left" ? (
              <>
                <div className="tl-left tl-card-wrap">
                  <div className="tl-card">
                    <div className="tl-date">{item.date}</div>
                    <div className="tl-title">{item.title}</div>
                    <p className="tl-text">{item.text}</p>
                  </div>
                </div>
                <div className="tl-dot-wrap">
                  <div className="tl-dot"></div>
                </div>
                <div className="tl-empty"></div>
              </>
            ) : (
              <>
                <div className="tl-empty"></div>
                <div className="tl-dot-wrap">
                  <div className="tl-dot"></div>
                </div>
                <div className="tl-right tl-card-wrap">
                  <div className="tl-card">
                    <div className="tl-date">{item.date}</div>
                    <div className="tl-title">{item.title}</div>
                    <p className="tl-text">{item.text}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}