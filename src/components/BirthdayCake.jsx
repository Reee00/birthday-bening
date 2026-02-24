import React, { useState } from "react";

const BirthdayCake = ({ onBlown }) => {
  const [flamesVisible, setFlamesVisible] = useState(true);
  const [smokesVisible, setSmokesVisible] = useState(false);

  const handleBlowCandles = () => {
    // Hide flames immediately
    setFlamesVisible(false);
    
    // Show smokes after short delay
    setTimeout(() => {
      setSmokesVisible(true);
    }, 150);

    // Callback to parent
    if (onBlown) {
      onBlown();
    }
  };

  return (
    <>
      <svg
        id="cakeSvg"
        width="220"
        height="220"
        viewBox="0 0 220 220"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cakeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1240" />
            <stop offset="100%" stopColor="#1a0a30" />
          </linearGradient>
          <linearGradient id="frostGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff6eb0" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#4fc3f7" />
          </linearGradient>
          <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e103a" />
            <stop offset="100%" stopColor="#100824" />
          </linearGradient>
        </defs>

        {/* PLATE */}
        <ellipse cx="110" cy="198" rx="82" ry="12" fill="url(#plateGrad)" opacity="0.8" />
        <ellipse cx="110" cy="196" rx="80" ry="10" fill="#1a0c36" opacity="0.5" />

        {/* CAKE BASE (bottom tier) */}
        <rect x="30" y="138" width="160" height="56" rx="6" fill="url(#cakeGrad)" />
        <ellipse cx="110" cy="194" rx="80" ry="7" fill="#110830" />
        <ellipse cx="110" cy="138" rx="80" ry="8" fill="#341565" opacity="0.7" />

        {/* bottom tier frosting drip */}
        <path
          d="M30 146 Q50 138 70 146 Q90 154 110 146 Q130 138 150 146 Q170 154 190 146 L190 138 Q170 130 150 138 Q130 146 110 138 Q90 130 70 138 Q50 146 30 138 Z"
          fill="url(#frostGrad)"
          opacity="0.85"
        />

        {/* drip drops bottom tier */}
        <ellipse cx="52" cy="150" rx="5" ry="8" fill="#ff6eb0" opacity="0.7" />
        <ellipse cx="90" cy="148" rx="4" ry="6" fill="#c084fc" opacity="0.7" />
        <ellipse cx="128" cy="152" rx="5" ry="9" fill="#4fc3f7" opacity="0.7" />
        <ellipse cx="168" cy="148" rx="4" ry="7" fill="#ffd77a" opacity="0.7" />

        {/* pink dots decoration */}
        <circle cx="45" cy="160" r="4" fill="#ff6eb0" opacity="0.5" />
        <circle cx="75" cy="165" r="3" fill="#c084fc" opacity="0.4" />
        <circle cx="105" cy="162" r="4" fill="#ffd77a" opacity="0.5" />
        <circle cx="135" cy="165" r="3" fill="#4fc3f7" opacity="0.4" />
        <circle cx="165" cy="160" r="4" fill="#ff6eb0" opacity="0.5" />

        {/* ♡ on side */}
        <text x="102" y="178" fontSize="14" fill="rgba(255,110,176,0.35)" fontFamily="serif">
          ♡
        </text>

        {/* MIDDLE TIER */}
        <rect x="50" y="90" width="120" height="52" rx="5" fill="url(#cakeGrad)" />
        <ellipse cx="110" cy="90" rx="60" ry="7" fill="#341565" opacity="0.75" />

        {/* middle frosting */}
        <path
          d="M50 99 Q68 90 86 99 Q104 108 122 99 Q140 90 158 99 Q170 105 170 90 Q152 82 134 90 Q116 98 98 90 Q80 82 62 90 Q50 96 50 90 Z"
          fill="url(#frostGrad)"
          opacity="0.85"
        />

        {/* drip drops middle */}
        <ellipse cx="65" cy="103" rx="4" ry="7" fill="#c084fc" opacity="0.65" />
        <ellipse cx="100" cy="101" rx="4" ry="6" fill="#ff6eb0" opacity="0.65" />
        <ellipse cx="140" cy="104" rx="4" ry="7" fill="#ffd77a" opacity="0.65" />

        {/* star text middle */}
        <text x="98" y="128" fontSize="13" fill="rgba(255,215,122,0.3)" fontFamily="serif">
          ✦
        </text>

        {/* TOP TIER */}
        <rect x="72" y="50" width="76" height="44" rx="5" fill="url(#cakeGrad)" />
        <ellipse cx="110" cy="50" rx="38" ry="6" fill="#341565" opacity="0.8" />

        {/* top tier frosting */}
        <path
          d="M72 58 Q87 50 102 58 Q117 66 132 58 Q145 50 148 50 Q140 44 124 50 Q109 58 94 50 Q80 44 72 50 Z"
          fill="url(#frostGrad)"
          opacity="0.9"
        />

        {/* drip top */}
        <ellipse cx="84" cy="61" rx="3.5" ry="5.5" fill="#4fc3f7" opacity="0.65" />
        <ellipse cx="110" cy="59" rx="3.5" ry="5" fill="#ff6eb0" opacity="0.65" />
        <ellipse cx="138" cy="60" rx="3" ry="4.5" fill="#c084fc" opacity="0.65" />

        {/* CANDLES */}
        <rect x="82" y="28" width="8" height="24" rx="2" fill="#c084fc" />
        <rect x="82" y="28" width="8" height="6" rx="1" fill="rgba(255,255,255,0.15)" />

        <rect x="97" y="24" width="8" height="28" rx="2" fill="#ff6eb0" />
        <rect x="97" y="24" width="8" height="6" rx="1" fill="rgba(255,255,255,0.15)" />

        <rect x="106" y="22" width="8" height="30" rx="2" fill="#ffd77a" />
        <rect x="106" y="22" width="8" height="6" rx="1" fill="rgba(255,255,255,0.15)" />

        <rect x="122" y="24" width="8" height="28" rx="2" fill="#4fc3f7" />
        <rect x="122" y="24" width="8" height="6" rx="1" fill="rgba(255,255,255,0.15)" />

        <rect x="130" y="28" width="8" height="24" rx="2" fill="#ff6eb0" />
        <rect x="130" y="28" width="8" height="6" rx="1" fill="rgba(255,255,255,0.15)" />

        {/* wicks */}
        <line x1="86" y1="28" x2="86" y2="22" stroke="#b89060" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="101" y1="24" x2="101" y2="18" stroke="#b89060" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="110" y1="22" x2="110" y2="16" stroke="#b89060" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="126" y1="24" x2="126" y2="18" stroke="#b89060" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="134" y1="28" x2="134" y2="22" stroke="#b89060" strokeWidth="1.5" strokeLinecap="round" />

        {/* FLAMES - CONDITIONAL RENDER */}
        {flamesVisible && (
          <g id="flamesGroup">
            {/* flame glow halos */}
            <circle className="fglow" cx="86" cy="18" r="10" fill="rgba(255,180,80,0.22)" />
            <circle className="fglow" cx="101" cy="14" r="10" fill="rgba(255,120,160,0.22)" />
            <circle className="fglow" cx="110" cy="12" r="12" fill="rgba(255,200,80,0.22)" />
            <circle className="fglow" cx="126" cy="14" r="10" fill="rgba(79,195,247,0.22)" />
            <circle className="fglow" cx="134" cy="18" r="10" fill="rgba(192,132,252,0.22)" />

            {/* flame 1 */}
            <g className="flame fl1" transform="translate(86,22)">
              <ellipse rx="4.5" ry="7" fill="#ffe56e" />
              <ellipse rx="2.5" ry="4" fill="#fff5b0" />
              <ellipse rx="1.2" ry="2" fill="#fff" />
            </g>

            {/* flame 2 */}
            <g className="flame fl2" transform="translate(101,18)">
              <ellipse rx="4.5" ry="7.5" fill="#ffb347" />
              <ellipse rx="2.5" ry="4.5" fill="#ffe56e" />
              <ellipse rx="1.2" ry="2.2" fill="#fff" />
            </g>

            {/* flame 3 center */}
            <g className="flame fl3" transform="translate(110,16)">
              <ellipse rx="5.5" ry="9" fill="#ff8c40" />
              <ellipse rx="3" ry="5.5" fill="#ffe56e" />
              <ellipse rx="1.4" ry="2.8" fill="#fff" />
            </g>

            {/* flame 4 */}
            <g className="flame fl4" transform="translate(126,18)">
              <ellipse rx="4.5" ry="7.5" fill="#ffb347" />
              <ellipse rx="2.5" ry="4.5" fill="#ffe56e" />
              <ellipse rx="1.2" ry="2.2" fill="#fff" />
            </g>

            {/* flame 5 */}
            <g className="flame fl5" transform="translate(134,22)">
              <ellipse rx="4.5" ry="7" fill="#ffe56e" />
              <ellipse rx="2.5" ry="4" fill="#fff5b0" />
              <ellipse rx="1.2" ry="2" fill="#fff" />
            </g>
          </g>
        )}

        {/* SMOKES - CONDITIONAL RENDER */}
        {smokesVisible && (
          <g id="smokesGroup">
            <rect className="smoke s1" x="84" y="10" width="3" height="0" />
            <rect className="smoke s2" x="99" y="6" width="3" height="0" />
            <rect className="smoke s3" x="108" y="4" width="3" height="0" />
            <rect className="smoke s4" x="124" y="6" width="3" height="0" />
            <rect className="smoke s5" x="132" y="10" width="3" height="0" />
          </g>
        )}
      </svg>

      {/* Blow Button */}
      {/* <button
        onClick={handleBlowCandles}
        style={{
          marginTop: "2rem",
          padding: "1rem 2rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          background: "linear-gradient(135deg, #ff6eb0, #9b59d6)",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        💨 Blow Candles
      </button> */}
    </>
  );
};

export default BirthdayCake;