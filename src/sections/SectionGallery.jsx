import React, { useEffect, useState, useRef } from "react";

// Data: 19 foto + 5 video
const gallery = [
  // 📸 PHOTOS
  { type: "photo", src: "public/photos/A_moment_intime.webp", caption: "A moment in time" },
  { type: "photo", src: "public/photos/Justustwo.webp", caption: "Just us two" },
  { type: "photo", src: "public/photos/smilesandstars.webp", caption: "Smiles & stars"},
  { type: "photo", src: "public/photos/goldenhour.webp", caption: "Golden hour"},
  { type: "photo", src: "public/photos/alwaysforever.webp", caption: "Always & forever" },
  { type: "photo", src: "public/photos/Yourbeautiful.webp", caption: "Your beautiful smile" },
  { type: "photo", src: "public/photos/adventurestogether.webp", caption: "Adventures together" },
  { type: "photo", src: "public/photos/ngejamu.webp", caption: "Nge Jamu" },
  { type: "photo", src: "public/photos/dancelikenobodys.webp", caption: "Dance like nobody's watching" },
  { type: "photo", src: "public/photos/ngelancong.webp", caption: "Ngelancong" },
  { type: "photo", src: "public/photos/coffedate.webp", caption: "Coffee date" },
  { type: "photo", src: "public/photos/homemadecoffee.webp", caption: "Home Made Coffee" },
  { type: "photo", src: "public/photos/Rainydaycuddies.webp", caption: "Rainy Day Cuddles" },
  { type: "photo", src: "public/photos/canditmoments.webp", caption: "Candid moments" },
  { type: "photo", src: "public/photos/NightWalks.webp", caption: "Night walks"},
  { type: "photo", src: "public/photos/wintervibes.webp", caption: "Winter vibes" },
  { type: "photo", src: "public/photos/sicantik.webp", caption: "Si Cantik" },
  { type: "photo", src: "public/photos/lastdayofyear.webp", caption: "Last day of year" },

  // 🎥 VIDEOS
  { type: "video", src: "public/videos/video1.mp4", poster: "public/videos/video1-poster.jpg", caption: "Our love story" },
  { type: "video", src: "public/videos/video2.mp4", poster: "public/videos/video2-poster.jpg", caption: "Dinner Date" },
  { type: "video", src: "public/videos/video3.mp4", poster: "public/videos/video3-poster.jpg", caption: "Funny moments" },
  { type: "video", src: "public/videos/video4.mp4", poster: "public/videos/video4-poster.jpg", caption: "Birthday wishes" },
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
  const [visibleThumbnails, setVisibleThumbnails] = useState(5);
  const autoPlayRef = useRef(null);
  const carouselRef = useRef(null);
  const videoRef = useRef(null);

  // Filter gallery items
  const filteredGallery =
    filterType === "all"
      ? gallery
      : gallery.filter((item) => item.type === filterType);

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
    }, 5000);

    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay, filteredGallery.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length
    );
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const openLightbox = (item) => {
    setLightboxType(item.type);
    setLightboxSrc(item.src);
    setLightboxCaption(item.caption);
    setLightboxOpen(true);
  };

  const current = filteredGallery[currentIndex];

  // Calculate visible thumbnail range untuk tidak overload
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

      {/* 🎠 CAROUSEL SECTION */}
      <div className="carousel-wrapper">
        {/* Filter Buttons */}
        <div className="gallery-filter">
          <button
            className={`filter-btn ${filterType === "all" ? "active" : ""}`}
            onClick={() => {
              setFilterType("all");
              setCurrentIndex(0);
            }}
          >
            All ({gallery.length})
          </button>
          <button
            className={`filter-btn ${filterType === "photo" ? "active" : ""}`}
            onClick={() => {
              setFilterType("photo");
              setCurrentIndex(0);
            }}
          >
            Photos (19)
          </button>
          <button
            className={`filter-btn ${filterType === "video" ? "active" : ""}`}
            onClick={() => {
              setFilterType("video");
              setCurrentIndex(0);
            }}
          >
            Videos (5)
          </button>
        </div>

        {/* Main Carousel */}
        <div className="carousel-container" ref={carouselRef}>
          {/* Slides */}
          <div className="carousel-track">
            {filteredGallery.map((item, idx) => (
              <div
                key={idx}
                className={`carousel-slide ${
                  idx === currentIndex ? "active" : ""
                }`}
              >
                <div className="carousel-image-wrapper">
                  {item.type === "photo" ? (
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="carousel-image"
                      onClick={() => openLightbox(item)}
                    />
                  ) : (
                    <div className="carousel-video-wrapper">
                      <video
                        ref={videoRef}
                        poster={item.poster}
                        className="carousel-video"
                        onClick={() => openLightbox(item)}
                      >
                        <source src={item.src} type="video/mp4" />
                      </video>
                      <div className="video-play-icon">
                        <div className="play-button">▶</div>
                      </div>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="carousel-type-badge">
                    {item.type === "photo" ? "📸" : "🎥"}
                  </div>

                  <div className="carousel-overlay">
                    <div className="carousel-info">
                      <h3 className="carousel-caption">{item.caption}</h3>
                      <p className="carousel-date">📅 {item.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            className="carousel-btn carousel-btn-prev"
            onClick={goToPrevious}
            aria-label="Previous"
          >
            ❮
          </button>
          <button
            className="carousel-btn carousel-btn-next"
            onClick={goToNext}
            aria-label="Next"
          >
            ❯
          </button>

          {/* Play/Pause Button */}
          <button
            className="carousel-play-btn"
            onClick={() => setAutoPlay(!autoPlay)}
            aria-label={autoPlay ? "Pause" : "Play"}
          >
            {autoPlay ? "⏸" : "▶"}
          </button>
        </div>

        {/* Photo Counter */}
        <div className="carousel-counter">
          {currentIndex + 1} / {filteredGallery.length}
        </div>

        {/* Thumbnails - Optimized untuk banyak item */}
        <div className="carousel-thumbnails-wrapper">
          <button
            className="thumb-nav-btn thumb-nav-prev"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 5))}
            style={{ visibility: thumbStart > 0 ? "visible" : "hidden" }}
          >
            ❮
          </button>

          <div className="carousel-thumbnails">
            {visibleThumbs.map((item, idx) => {
              const actualIdx = thumbStart + idx;
              return (
                <button
                  key={actualIdx}
                  className={`carousel-thumbnail ${
                    actualIdx === currentIndex ? "active" : ""
                  }`}
                  onClick={() => goToSlide(actualIdx)}
                  aria-label={`Go to ${item.caption}`}
                  title={item.caption}
                >
                  {item.type === "photo" ? (
                    <img src={item.src} alt={item.caption} loading="lazy" />
                  ) : (
                    <>
                      <img
                        src={item.poster}
                        alt={item.caption}
                        loading="lazy"
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
            onClick={() =>
              setCurrentIndex(
                Math.min(
                  filteredGallery.length - 1,
                  currentIndex + 5
                )
              )
            }
            style={{
              visibility: thumbEnd < filteredGallery.length ? "visible" : "hidden",
            }}
          >
            ❯
          </button>
        </div>

        {/* Dots Indicator - Smart dots untuk banyak item */}
        <div className="carousel-dots-container">
          <div className="carousel-dots">
            {filteredGallery.length <= 10
              ? filteredGallery.map((_, idx) => (
                  <button
                    key={idx}
                    className={`carousel-dot ${
                      idx === currentIndex ? "active" : ""
                    }`}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))
              : // Untuk lebih dari 10, tampilkan progress bar
              null}
          </div>
          {filteredGallery.length > 10 && (
            <div className="carousel-progress">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${((currentIndex + 1) / filteredGallery.length) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 🖼️ LIGHTBOX - Support Photo & Video */}
      <div
        id="lightbox"
        className={`lightbox${lightboxOpen ? " open" : ""}`}
        onClick={() => setLightboxOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-hidden={!lightboxOpen}
      >
        <button
          id="lightboxClose"
          className="lightbox-close"
          aria-label="Close"
          onClick={() => setLightboxOpen(false)}
        >
          ✕
        </button>

        {lightboxType === "photo" ? (
          <img
            id="lightboxImg"
            className="lightbox-img"
            src={lightboxSrc}
            alt={lightboxCaption}
          />
        ) : (
          <video
            id="lightboxVideo"
            className="lightbox-video"
            controls
            autoPlay
            onClick={(e) => e.stopPropagation()}
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