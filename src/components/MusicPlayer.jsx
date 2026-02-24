import React, { useRef, useState, useEffect } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const barsRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleToggleMusic = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .then(() => {
            setPlaying(true);
            if (barsRef.current)
              barsRef.current.classList.remove("paused");
          })
          .catch(() => {
            // Browser blocked autoplay
          });
      }
      setPlaying(!playing);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const handleCanPlay = () => {
      audio
        .play()
        .then(() => {
          setPlaying(true);
          if (barsRef.current) barsRef.current.classList.remove("paused");
        })
        .catch(() => {
          // Browser blocked autoplay
        });
    };

    const handleError = () => {
      // Audio not found, hide player
      const player = document.getElementById("musicPlayer");
      if (player) player.style.display = "none";
    };

    audio.addEventListener("canplaythrough", handleCanPlay, { once: true });
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  // Enable audio on first touch for mobile
  useEffect(() => {
    const handleFirstTouch = () => {
      if (audioRef.current && !playing) {
        audioRef.current
          .play()
          .then(() => {
            setPlaying(true);
            if (barsRef.current)
              barsRef.current.classList.remove("paused");
          })
          .catch(() => {});
      }
      document.removeEventListener("touchstart", handleFirstTouch);
    };

    document.addEventListener("touchstart", handleFirstTouch, {
      once: true,
      passive: true,
    });

    return () => {
      document.removeEventListener("touchstart", handleFirstTouch);
    };
  }, [playing]);

  return (
    <div id="musicPlayer" className="music-player">
      <button
        id="musicToggle"
        className="music-toggle"
        aria-label="Toggle music"
        onClick={handleToggleMusic}
      >
        {playing ? "⏸" : "▶"}
      </button>
      <div className="music-info">
        <div className="music-title" id="musicTitle">
          Ambient Melody
        </div>
        <div className="music-sub">Background · Tap to play</div>
      </div>
      <div
        className={`music-bars${playing ? "" : " paused"}`}
        id="musicBars"
        ref={barsRef}
      >
        <div className="music-bar"></div>
        <div className="music-bar"></div>
        <div className="music-bar"></div>
        <div className="music-bar"></div>
        <div className="music-bar"></div>
      </div>
      <input
        type="range"
        className="music-vol"
        id="musicVol"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        aria-label="Volume"
      />
      <audio
        ref={audioRef}
        id="bgAudio"
        loop
        src="/music/ambient.mp3"
      />
    </div>
  );
}