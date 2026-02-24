import React, { useState } from "react";

export default function SectionLetter() {
  const [expanded, setExpanded] = useState(false);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <section className="letter-section">
      <div className="section-divider"></div>
      <div className="section-label" style={{ marginTop: "1.5rem" }}>
        For your eyes only
      </div>
      <h2 className="section-heading">
        A Letter, From <em>Me</em>
      </h2>

      <div className="letter-wrap">
        <div className="letter-inner">
          <div className="letter-greeting">
            My dearest <span>love,</span>
          </div>

          <div className="letter-body">
            <div className="letter-preview">
              <p>
                On this special day, I want you to know just how much you mean
                to me. Words feel inadequate when I try to capture what you've
                brought into my life — but I'll try anyway, under these February
                stars.
              </p>
              <p>
                You make ordinary moments extraordinary. The way you laugh at my
                terrible jokes, how you know exactly when I need a hug — these
                small things have become the most important parts of my day.
              </p>
            </div>

            <div
              className={`letter-more${expanded ? " open" : ""}`}
              id="letterMore"
            >
              <p>
                You've taught me what it means to be truly seen and loved. With
                you, I don't have to pretend or hide. You've created a space
                where I can be completely myself, and that is one of the
                greatest gifts anyone has ever given me.
              </p>
              <p>
                I love watching you do the things you're passionate about. I
                love how you light up when you talk about something you care
                about. I love your kindness, your strength, and even your
                stubbornness — yes, even that.
              </p>
              <p>
                As you celebrate another year around the sun, I want you to
                know: I am proud of who you are, and I am endlessly grateful
                that out of all the people in the universe, I get to be the one
                by your side.
              </p>
              <p>
                Happy birthday, my love. Here's to all the adventures still
                waiting for us — all the stars we haven't named yet.
              </p>
            </div>
          </div>

          <button
            className={`letter-expand-btn${expanded ? " open" : ""}`}
            id="letterExpandBtn"
            aria-expanded={expanded}
            onClick={handleExpandToggle}
          >
            <span id="expandText">{expanded ? "Read Less" : "Read More"}</span>
            <em className="letter-expand-icon">{expanded ? "↑" : "↓"}</em>
          </button>

          <div className="letter-sig">Forever yours ❤</div>
        </div>
      </div>
    </section>
  );
}