import React, { useEffect, useState, useRef, useCallback } from "react";

// Data: 18 foto + 4 video
const gallery = [
  // 📸 PHOTOS
  { type: "photo", src: "/photos/A_moment_intime.webp", caption: "A moment in time" },
  { type: "photo", src: "/photos/Justustwo.webp", caption: "Just us two" },
  { type: "photo", src: "/photos/smilesandstars.webp", caption: "Smiles & stars" },
  { type: "photo", src: "/photos/goldenhour.webp", caption: "Golden hour" },
  { type: "photo", src: "/photos/alwaysforever.webp", caption: "Always & forever" },
  { type: "photo", src: "/photos/Yourbeautiful.webp", caption: "Your beautiful smile" },
  { type: "photo", src: "/photos/adventurestogether.webp", caption: "Adventures together" },
  { type: "photo", src: "/photos/ngejamu.webp", caption: "Nge Jamu" },
  { type: "photo", src: "/photos/dancelikenobodys.webp", caption: "Dance like nobody's watching" },
  { type: "photo", src: "/photos/ngelancong.webp", caption: "Ngelancong" },
  { type: "photo", src: "/photos/coffedate.webp", caption: "Coffee date" },
  { type: "photo", src: "/photos/homemadecoffee.webp", caption: "Home Made Coffee" },
  { type: "photo", src: "/photos/Rainydaycuddies.webp", caption: "Rainy Day Cuddles" },
  { type: "photo", src: "/photos/canditmoments.webp", caption: "Candid moments" },
  { type: "photo", src: "/photos/NightWalks.webp", caption: "Night walks" },
  { type: "photo", src: "/photos/wintervibes.webp", caption: "Winter vibes" },
  { type: "photo", src: "/photos/sicantik.webp", caption: "Si Cantik" },
  { type: "photo", src: "/photos/lastdayofyear.webp", caption: "Last day of year" },

  // 🎥 VIDEOS
  { type: "video", src: "/videos/video1.mp4", poster: "", caption: "Our love story" },
  { type: "video", src: "/videos/video2.mp4", poster: "", caption: "Dinner Date" },
  { type: "video", src: "/videos/video3.mp4", poster: "", caption: "Funny moments" },
  { type: "video", src: "/videos/video4.mp4", poster: "", caption: "Birthday wishes" },
];

const placeholderColors = [
  ["#2a0a4a", "#ff6eb0", "#9b59d6"],
  ["#030a2a", "#4fc3f7", "#9b59d6"],
  ["#1a0830", "#ffd77a", "#ff6eb0"],
  ["#1a0a00", "#ffd77a", "#ff8c40"],
  ["#0a0a2a", "#9b59d6", "#4fc3f7"],
  ["#0a2a1a", "#4fc3f7", "#ffd77a"],
  ["#2a0a1a", "#ff6eb0", "#c084fc"],
  ["#1a1a0a", "#ffd77a", "#ff6eb0"],
  ["#0a0a3a", "#c084fc", "#4fc3f7"],
  ["#2a0a0a", "#ff6eb0", "#ffd77a"],
];

const icons = ["✦", "♡", "✧", "◇", "★", "✿", "💫", "🌟", "💕", "🎀"];

export default function SectionGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxType, setLightboxType] = useState("photo");
  const [lightboxSrc, setLightboxSrc] = useState("");
  const [lightboxCaption, setLightboxCaption] = useState("");
  const [autoPlay, setAutoPlay] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [visibleThumbnails] = useState(5);

  // ✅ FIX 1: Pakai Map of refs — satu ref per video element
  const videoRefs = useRef({});
  // ✅ Track video mana yang sedang playing di carousel
  const [playingVideoIndex, setPlayingVideoIndex] = useState(null);

  const autoPlayRef = useRef(null);
  const carouselRef = useRef(null);

  // Filter gallery items
  const filteredGallery =
    filterType === "all"
      ? gallery
      : gallery.filter((item) => item.type === filterType);

  // Hitung jumlah dinamis
  const photoCount = gallery.filter((i) => i.type === "photo").length;
  const videoCount = gallery.filter((i) => i.type === "video").length;

  // ✅ FIX 2: Pause semua video yang sedang play ketika slide berganti
  const pauseAllVideos = useCallback(() => {
    Object.values(videoRefs.current).forEach((vid) => {
      if (vid && !vid.paused) {
        vid.pause();
        vid.currentTime = 0;
      }
    });
    setPlayingVideoIndex(null);
  }, []);

  // Auto-play carousel — pause video saat slide berganti
  useEffect(() => {
    if (!autoPlay) return;
    autoPlayRef.current = setInterval(() => {
      pauseAllVideos();
      setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
    }, 5000);
    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay, filteredGallery.length, pauseAllVideos]);

  // Pause semua video saat index berubah
  useEffect(() => {
    pauseAllVideos();
  }, [currentIndex, pauseAllVideos]);

  const goToSlide = (index) => {
    pauseAllVideos();
    setCurrentIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToPrevious = () => {
    pauseAllVideos();
    setCurrentIndex(
      (prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length
    );
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToNext = () => {
    pauseAllVideos();
    setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  // ✅ FIX 3: Handler play/pause video di carousel — tidak buka lightbox
  const handleVideoPlayPause = (e, idx) => {
    e.stopPropagation(); // cegah event bubble ke lightbox
    const vid = videoRefs.current[idx];
    if (!vid) return;

    if (vid.paused) {
      // Pause video lain dulu
      Object.entries(videoRefs.current).forEach(([key, v]) => {
        if (String(key) !== String(idx) && v && !v.paused) {
          v.pause();
          v.currentTime = 0;
        }
      });
      vid.play();
      setPlayingVideoIndex(idx);
      // Hentikan autoplay carousel saat video sedang play
      setAutoPlay(false);
    } else {
      vid.pause();
      setPlayingVideoIndex(null);
      setTimeout(() => setAutoPlay(true), 3000);
    }
  };

  const openLightbox = (item) => {
    pauseAllVideos();
    setLightboxType(item.type);
    setLightboxSrc(item.src);
    setLightboxCaption(item.caption);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const current = filteredGallery[currentIndex];

  // Visible thumbnails range
  const thumbStart = Math.max(0, currentIndex - visibleThumbnails);
  const thumbEnd = Math.min(
    filteredGallery.length,
    currentIndex + visibleThumbnails + 1
  );
  const visibleThumbs = filteredGallery.slice(thumbStart, thumbEnd);

  return (
    <section className="gallery-section">
      <div className="section-divider"></div>
      <div className="section-label reveal-up" style={{ marginTop: "1.5rem" }}>
        Our memories
      </div>
      <h2 className="section-heading reveal-zoom">
        A Glimpse of <em>Us</em>
      </h2>

      {/* 🎠 CAROUSEL */}
      <div className="carousel-wrapper">

        {/* Filter Buttons — angka dihitung dinamis */}
        <div className="gallery-filter">
          <button
            className={`filter-btn ${filterType === "all" ? "active" : ""}`}
            onClick={() => { setFilterType("all"); setCurrentIndex(0); pauseAllVideos(); }}
          >
            All ({gallery.length})
          </button>
          <button
            className={`filter-btn ${filterType === "photo" ? "active" : ""}`}
            onClick={() => { setFilterType("photo"); setCurrentIndex(0); pauseAllVideos(); }}
          >
            Photos ({photoCount})
          </button>
          <button
            className={`filter-btn ${filterType === "video" ? "active" : ""}`}
            onClick={() => { setFilterType("video"); setCurrentIndex(0); pauseAllVideos(); }}
          >
            Videos ({videoCount})
          </button>
        </div>

        {/* Main Carousel */}
        <div className="carousel-container" ref={carouselRef}>
          <div className="carousel-track">
            {filteredGallery.map((item, idx) => (
              <div
                key={idx}
                className={`carousel-slide ${idx === currentIndex ? "active" : ""}`}
              >
                <div className="carousel-image-wrapper">

                  {item.type === "photo" ? (
                    // Foto — klik buka lightbox
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="carousel-image"
                      onClick={() => openLightbox(item)}
                    />
                  ) : (
                    // ✅ FIX: Video dengan ref per-index dan play button yang berfungsi
                    <div className="carousel-video-wrapper">
                      <video
                        // ✅ Assign ref ke map berdasarkan index
                        ref={(el) => {
                          if (el) videoRefs.current[idx] = el;
                          else delete videoRefs.current[idx];
                        }}
                        poster={item.poster || undefined}
                        className="carousel-video"
                        playsInline
                        preload="metadata"
                        // Klik video langsung toggle play/pause
                        onClick={(e) => handleVideoPlayPause(e, idx)}
                        onEnded={() => {
                          setPlayingVideoIndex(null);
                          setTimeout(() => setAutoPlay(true), 2000);
                        }}
                      >
                        <source src={item.src} type="video/mp4" />
                        Browser kamu tidak mendukung video.
                      </video>

                      {/* ✅ Play button overlay — hanya tampil saat video tidak playing */}
                      {playingVideoIndex !== idx && (
                        <div
                          className="video-play-icon"
                          onClick={(e) => handleVideoPlayPause(e, idx)}
                        >
                          <div className="play-button">▶</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Badge type */}
                  <div className="carousel-type-badge">
                    {item.type === "photo" ? "📸" : "🎥"}
                  </div>

                  <div className="carousel-overlay">
                    <div className="carousel-info">
                      <h3 className="carousel-caption">{item.caption}</h3>
                      {/* ✅ item.date dihapus karena tidak ada di data */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="carousel-btn carousel-btn-prev" onClick={goToPrevious} aria-label="Previous">❮</button>
          <button className="carousel-btn carousel-btn-next" onClick={goToNext} aria-label="Next">❯</button>

          {/* Autoplay toggle */}
          <button
            className="carousel-play-btn"
            onClick={() => {
              if (autoPlay) pauseAllVideos();
              setAutoPlay(!autoPlay);
            }}
            aria-label={autoPlay ? "Pause slideshow" : "Play slideshow"}
          >
            {autoPlay ? "⏸" : "▶"}
          </button>
        </div>

        {/* Counter */}
        <div className="carousel-counter">
          {currentIndex + 1} / {filteredGallery.length}
        </div>

        {/* Thumbnails */}
        <div className="carousel-thumbnails-wrapper">
          <button
            className="thumb-nav-btn thumb-nav-prev"
            onClick={() => goToSlide(Math.max(0, currentIndex - 5))}
            style={{ visibility: thumbStart > 0 ? "visible" : "hidden" }}
          >❮</button>

          <div className="carousel-thumbnails">
            {visibleThumbs.map((item, idx) => {
              const actualIdx = thumbStart + idx;
              return (
                <button
                  key={actualIdx}
                  className={`carousel-thumbnail ${actualIdx === currentIndex ? "active" : ""}`}
                  onClick={() => goToSlide(actualIdx)}
                  aria-label={`Go to ${item.caption}`}
                  title={item.caption}
                >
                  {item.type === "photo" ? (
                    <img src={item.src} alt={item.caption} loading="lazy" />
                  ) : (
                    <>
                      <img
                        src={item.poster || undefined}
                        alt={item.caption}
                        loading="lazy"
                        style={{ background: "#1a0830" }}
                      />
                      <div className="video-badge-small">🎥</div>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <button
            className="thumb-nav-btn thumb-nav-next"
            onClick={() => goToSlide(Math.min(filteredGallery.length - 1, currentIndex + 5))}
            style={{ visibility: thumbEnd < filteredGallery.length ? "visible" : "hidden" }}
          >❯</button>
        </div>

        {/* Dots / Progress bar */}
        <div className="carousel-dots-container">
          <div className="carousel-dots">
            {filteredGallery.length <= 10
              ? filteredGallery.map((_, idx) => (
                  <button
                    key={idx}
                    className={`carousel-dot ${idx === currentIndex ? "active" : ""}`}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))
              : null}
          </div>
          {filteredGallery.length > 10 && (
            <div className="carousel-progress">
              <div
                className="progress-bar-fill"
                style={{ width: `${((currentIndex + 1) / filteredGallery.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 🖼️ LIGHTBOX */}
      <div
        id="lightbox"
        className={`lightbox${lightboxOpen ? " open" : ""}`}
        onClick={closeLightbox}
        role="dialog"
        aria-modal="true"
        aria-hidden={!lightboxOpen}
      >
        <button
          id="lightboxClose"
          className="lightbox-close"
          aria-label="Close"
          onClick={closeLightbox}
        >✕</button>

        {lightboxType === "photo" ? (
          <img
            id="lightboxImg"
            className="lightbox-img"
            src={lightboxSrc}
            alt={lightboxCaption}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          // ✅ Video di lightbox pakai tag video sendiri, tidak pakai ref carousel
          <video
            id="lightboxVideo"
            className="lightbox-video"
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
            // Reset src tiap lightbox dibuka agar tidak cache state lama
            key={lightboxSrc}
          >
            <source src={lightboxSrc} type="video/mp4" />
          </video>
        )}

        <div id="lightboxCaption" className="lightbox-caption">
          {lightboxCaption}
        </div>
      </div>
    </section>
  );
}