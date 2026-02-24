import React, { useState, useEffect } from "react";

const starMessages = [
  {
    icon: "✦",
    label: "Your laugh",
    msg: "Your laugh is the best sound in the universe",
  },
  {
    icon: "♡",
    label: "Your kindness",
    msg: "The way you care for others leaves me speechless",
  },
  {
    icon: "✧",
    label: "Your courage",
    msg: "You face every challenge with quiet, stunning strength",
  },
  {
    icon: "◇",
    label: "Your mind",
    msg: "The way you think endlessly fascinates me",
  },
  {
    icon: "✦",
    label: "Your warmth",
    msg: "Everyone feels safe and seen in your presence",
  },
  {
    icon: "♡",
    label: "Your smile",
    msg: "You have no idea how it lights up a room",
  },
  {
    icon: "✧",
    label: "Your voice",
    msg: "I could listen to you talk about anything, forever",
  },
  {
    icon: "◇",
    label: "Your presence",
    msg: "Being near you feels like coming home",
  },
  {
    icon: "✦",
    label: "Your heart",
    msg: "Loving you is the greatest privilege of my life",
  },
];

export default function SectionStars({ onSpawnSparks, onShowToast }) {
  const [revealed, setRevealed] = useState(0);
  const [revealedCards, setRevealedCards] = useState(new Set());

  const handleStarClick = (idx, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isRevealed = revealedCards.has(idx);

    // Spawn sparks
    if (onSpawnSparks) {
      onSpawnSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);
    }

    // Toggle reveal
    const newRevealedCards = new Set(revealedCards);
    if (isRevealed) {
      newRevealedCards.delete(idx);
      setRevealed((prev) => prev - 1);
    } else {
      newRevealedCards.add(idx);
      const newCount = newRevealedCards.size;
      setRevealed(newCount);

      // Show toast when all revealed
      if (newCount === starMessages.length && onShowToast) {
        setTimeout(
          () =>
            onShowToast("✦ All stars revealed ✦", 3000),
          300
        );
      }
    }
    setRevealedCards(newRevealedCards);
  };

  return (
    <section className="stars-section">
      <div className="section-divider"></div>
      <div className="section-label" style={{ marginTop: "1.5rem" }}>
        Touch each star
      </div>
      <h2 className="section-heading">
        Things I <em>Love</em> About You
      </h2>

      <div className="stars-grid" id="starsGrid">
        {starMessages.map((star, idx) => (
          <div
            key={idx}
            className={`star-card${revealedCards.has(idx) ? " revealed" : ""}`}
            role="button"
            aria-label={`Star ${idx + 1}: ${star.label}`}
            onClick={(e) => handleStarClick(idx, e)}
            onTouchStart={(e) => {
              e.preventDefault();
              handleStarClick(idx, e);
            }}
          >
            <div className="star-icon">{star.icon}</div>
            <div className="star-label">{star.label}</div>
            <div className="star-message">{star.msg}</div>
          </div>
        ))}
      </div>

      <div className="stars-progress-wrap" id="starsProgressWrap">
        <div className="stars-progress-label">Discovered</div>
        <div className="stars-progress-bar">
          <div
            className="stars-progress-fill"
            id="progressFill"
            style={{ width: `${(revealed / starMessages.length) * 100}%` }}
          ></div>
        </div>
        <div className="stars-count" id="starsCount">
          {revealed}/{starMessages.length}
        </div>
      </div>
    </section>
  );
}