import React, { useEffect, useState, useRef, useCallback } from "react";

// Data: 18 foto + 4 video
const gallery = [
  // 📸 PHOTOS
  { type: "photo", src: "/photos/A_moment_intime.webp",      caption: "A moment in time" },
  { type: "photo", src: "/photos/Jususttwo.webp",             caption: "Just us two" },
  { type: "photo", src: "/photos/smilesandstars.webp",        caption: "Smiles & stars" },
  { type: "photo", src: "/photos/goldenhour.webp",            caption: "Golden hour" },
  { type: "photo", src: "/photos/alwaysforever.webp",         caption: "Always & forever" },
  { type: "photo", src: "/photos/Yourbeautiful.webp",         caption: "Your beautiful smile" },
  { type: "photo", src: "/photos/adventurestogether.webp",    caption: "Adventures together" },
  { type: "photo", src: "/photos/ngejamu.webp",               caption: "Nge Jamu" },
  { type: "photo", src: "/photos/dancelikenobodys.webp",      caption: "Dance like nobody's watching" },
  { type: "photo", src: "/photos/ngelancong.webp",            caption: "Ngelancong" },
  { type: "photo", src: "/photos/coffedate.webp",             caption: "Coffee date" },
  { type: "photo", src: "/photos/homemadecoffee.webp",        caption: "Home Made Coffee" },
  { type: "photo", src: "/photos/Rainydaycuddies.webp",       caption: "Rainy Day Cuddles" },
  { type: "photo", src: "/photos/canditmoments.webp",         caption: "Candid moments" },
  { type: "photo", src: "/photos/NightWalks.webp",            caption: "Night walks" },
  { type: "photo", src: "/photos/wintervibes.webp",           caption: "Winter vibes" },
  { type: "photo", src: "/photos/sicantik.webp",              caption: "Si Cantik" },
  { type: "photo", src: "/photos/lastdayofyear.webp",         caption: "Last day of year" },

  // 🎥 VIDEOS
  { type: "video", src: "/videos/video1.mp4", poster: "/videos/poster1.webp", caption: "Our love story" },
  { type: "video", src: "/videos/video2.mp4", poster: "/videos/poster2.webp", caption: "Dinner Date" },
  { type: "video", src: "/videos/video3.mp4", poster: "/videos/poster3.webp", caption: "Funny moments" },
  { type: "video", src: "/videos/video4.mp4", poster: "/videos/poster4.webp", caption: "Birthday wishes" },
];

export default function SectionGallery() {
  const [currentIndex, setCurrentIndex]     = useState(0);
  const [lightboxOpen, setLightboxOpen]     = useState(false);
  const [lightboxItem, setLightboxItem]     = useState(null);
  const [autoPlay, setAutoPlay]             = useState(true);
  const [filterType, setFilterType]         = useState("all");
  const [playingInline, setPlayingInline]   = useState(false); // tracks inline video play state

  const autoPlayRef       = useRef(null);
  const autoPlayPauseRef  = useRef(null);
  // FIX 1: Use a Map of refs keyed by index instead of a single ref
  const videoRefs         = useRef({});
  const lightboxVideoRef  = useRef(null);
  const thumbnailsRef     = useRef(null);

  // ─── Filtered list ─────────────────────────────────────────────
  const filteredGallery = filterType === "all"
    ? gallery
    : gallery.filter((item) => item.type === filterType);

  const current = filteredGallery[currentIndex] ?? filteredGallery[0];

  // ─── Auto-play carousel (skip when current slide is a playing video) ─
  useEffect(() => {
    clearInterval(autoPlayRef.current);
    if (!autoPlay || playingInline) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
    }, 5000);

    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay, playingInline, filteredGallery.length]);

  // FIX 2: Pause any inline video when slide changes
  useEffect(() => {
    // Pause all inline videos whenever the active slide changes
    Object.values(videoRefs.current).forEach((v) => {
      if (v && !v.paused) {
        v.pause();
      }
    });
    setPlayingInline(false);
  }, [currentIndex]);

  // ─── Scroll active thumbnail into view ─────────────────────────
  useEffect(() => {
    const activeThumb = thumbnailsRef.current?.querySelector(".carousel-thumbnail.active");
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [currentIndex]);

  // ─── Navigation helpers ─────────────────────────────────────────
  const pauseAutoPlayTemporarily = useCallback(() => {
    setAutoPlay(false);
    clearTimeout(autoPlayPauseRef.current);
    autoPlayPauseRef.current = setTimeout(() => setAutoPlay(true), 12000);
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    pauseAutoPlayTemporarily();
  }, [pauseAutoPlayTemporarily]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
    pauseAutoPlayTemporarily();
  }, [filteredGallery.length, pauseAutoPlayTemporarily]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
    pauseAutoPlayTemporarily();
  }, [filteredGallery.length, pauseAutoPlayTemporarily]);

  // ─── Keyboard navigation ────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (lightboxOpen) {
        if (e.key === "Escape") closeLightbox();
        return;
      }
      if (e.key === "ArrowLeft")  goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goToPrevious, goToNext]);

  // ─── FIX 3: Inline video play/pause handler ─────────────────────
  const handleInlineVideoClick = useCallback((e, idx) => {
    e.stopPropagation(); // don't open lightbox on video click
    const vid = videoRefs.current[idx];
    if (!vid) return;

    if (vid.paused) {
      vid.play().catch(() => {}); // catch autoplay-policy errors gracefully
      setPlayingInline(true);
      pauseAutoPlayTemporarily();
    } else {
      vid.pause();
      setPlayingInline(false);
    }
  }, [pauseAutoPlayTemporarily]);

  // Track when a video ends so autoplay can resume
  const handleVideoEnded = useCallback(() => {
    setPlayingInline(false);
  }, []);

  // ─── Lightbox ───────────────────────────────────────────────────
  const openLightbox = useCallback((item) => {
    // Pause inline video before opening lightbox
    Object.values(videoRefs.current).forEach((v) => { if (v) v.pause(); });
    setPlayingInline(false);
    setLightboxItem(item);
    setLightboxOpen(true);
    setAutoPlay(false);
    document.body.style.overflow = "hidden";
  }, []);

  // FIX 4: Properly stop lightbox video on close
  const closeLightbox = useCallback(() => {
    if (lightboxVideoRef.current) {
      lightboxVideoRef.current.pause();
      lightboxVideoRef.current.currentTime = 0;
    }
    setLightboxOpen(false);
    setLightboxItem(null);
    document.body.style.overflow = "";
    setTimeout(() => setAutoPlay(true), 500);
  }, []);

  // ─── Swipe support ──────────────────────────────────────────────
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? goToNext() : goToPrevious();
    touchStartX.current = null;
  };

  // ─── Filter change ──────────────────────────────────────────────
  const changeFilter = (type) => {
    setFilterType(type);
    setCurrentIndex(0);
    setPlayingInline(false);
  };

  // ─── Photo counts ───────────────────────────────────────────────
  const photoCount = gallery.filter(i => i.type === "photo").length;
  const videoCount = gallery.filter(i => i.type === "video").length;

  return (
    <section className="gallery-section">
      <div className="section-divider" />
      <div className="section-label reveal-up" style={{ marginTop: "1.5rem" }}>
        Our memories
      </div>
      <h2 className="section-heading reveal-zoom">
        A Glimpse of <em>Us</em>
      </h2>

      {/* ─── CAROUSEL ─────────────────────────────────────────────── */}
      <div className="carousel-wrapper">

        {/* Filter Buttons */}
        <div className="gallery-filter">
          {[
            { key: "all",   label: `All (${gallery.length})` },
            { key: "photo", label: `Photos (${photoCount})` },
            { key: "video", label: `Videos (${videoCount})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`filter-btn ${filterType === key ? "active" : ""}`}
              onClick={() => changeFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Main Carousel */}
        <div
          className="carousel-container"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="carousel-track">
            {filteredGallery.map((item, idx) => (
              <div
                key={`${item.src}-${idx}`}
                className={`carousel-slide ${idx === currentIndex ? "active" : ""}`}
                aria-hidden={idx !== currentIndex}
              >
                <div className="carousel-image-wrapper">

                  {item.type === "photo" ? (
                    /* ── PHOTO ── */
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="carousel-image"
                      loading={Math.abs(idx - currentIndex) <= 1 ? "eager" : "lazy"}
                      onClick={() => openLightbox(item)}
                    />
                  ) : (
                    /* ── VIDEO ──
                       FIX: each video gets its own ref via callback ref,
                       and click handler plays/pauses inline without opening lightbox.
                       A separate "open in fullscreen" icon opens the lightbox. */
                    <div className="carousel-video-wrapper">
                      <video
                        ref={(el) => {
                          // FIX 1 applied: store each video element by index
                          if (el) videoRefs.current[idx] = el;
                          else    delete videoRefs.current[idx];
                        }}
                        poster={item.poster}
                        className="carousel-video"
                        playsInline          // required for iOS inline play
                        preload="metadata"   // only load metadata, not full video
                        onEnded={handleVideoEnded}
                        onPlay={() => setPlayingInline(true)}
                        onPause={() => setPlayingInline(false)}
                        onClick={(e) => handleInlineVideoClick(e, idx)}
                      >
                        <source src={item.src} type="video/mp4" />
                        Your browser does not support HTML5 video.
                      </video>

                      {/* Overlay play button — only shown when video is paused */}
                      <div
                        className="video-play-overlay"
                        onClick={(e) => handleInlineVideoClick(e, idx)}
                        aria-label="Play video"
                        role="button"
                        tabIndex={idx === currentIndex ? 0 : -1}
                      >
                        <div className="play-button">▶</div>
                      </div>

                      {/* Fullscreen / lightbox icon */}
                      <button
                        className="video-fullscreen-btn"
                        onClick={() => openLightbox(item)}
                        aria-label="Open video in fullscreen"
                      >
                        ⛶
                      </button>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="carousel-type-badge" aria-hidden="true">
                    {item.type === "photo" ? "📸" : "🎥"}
                  </div>

                  {/* Caption overlay */}
                  <div className="carousel-overlay">
                    <div className="carousel-info">
                      <h3 className="carousel-caption">{item.caption}</h3>
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
            aria-label="Previous slide"
          >
            ❮
          </button>
          <button
            className="carousel-btn carousel-btn-next"
            onClick={goToNext}
            aria-label="Next slide"
          >
            ❯
          </button>

          {/* Auto-play toggle */}
          <button
            className="carousel-play-btn"
            onClick={() => {
              setAutoPlay((prev) => !prev);
              clearTimeout(autoPlayPauseRef.current);
            }}
            aria-label={autoPlay ? "Pause slideshow" : "Play slideshow"}
            title={autoPlay ? "Pause slideshow" : "Play slideshow"}
          >
            {autoPlay ? "⏸" : "▶"}
          </button>
        </div>

        {/* Counter */}
        <div className="carousel-counter" aria-live="polite">
          {currentIndex + 1} / {filteredGallery.length}
        </div>

        {/* Thumbnails */}
        <div className="carousel-thumbnails-wrapper">
          <div className="carousel-thumbnails" ref={thumbnailsRef}>
            {filteredGallery.map((item, idx) => (
              <button
                key={`thumb-${idx}`}
                className={`carousel-thumbnail ${idx === currentIndex ? "active" : ""}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to: ${item.caption}`}
                title={item.caption}
              >
                {item.type === "photo" ? (
                  <img src={item.src} alt={item.caption} loading="lazy" />
                ) : (
                  <>
                    {/* FIX 5: Use poster image for video thumbnails, fallback to a colored div */}
                    {item.poster
                      ? <img src={item.poster} alt={item.caption} loading="lazy" />
                      : <div className="thumb-video-fallback">🎥</div>
                    }
                    <div className="video-badge-small" aria-hidden="true">🎥</div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Progress / Dots */}
        <div className="carousel-dots-container">
          {filteredGallery.length <= 10 ? (
            <div className="carousel-dots" role="tablist">
              {filteredGallery.map((_, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={idx === currentIndex}
                  className={`carousel-dot ${idx === currentIndex ? "active" : ""}`}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          ) : (
            <div className="carousel-progress" aria-hidden="true">
              <div
                className="progress-bar-fill"
                style={{ width: `${((currentIndex + 1) / filteredGallery.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ─── LIGHTBOX ─────────────────────────────────────────────── */}
      {lightboxOpen && lightboxItem && (
        <div
          className="lightbox open"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.caption}
        >
          <button
            className="lightbox-close"
            aria-label="Close lightbox"
            onClick={closeLightbox}
          >
            ✕
          </button>

          {lightboxItem.type === "photo" ? (
            <img
              className="lightbox-img"
              src={lightboxItem.src}
              alt={lightboxItem.caption}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            /* FIX 4: lightbox video has its own ref for proper pause-on-close */
            <video
              ref={lightboxVideoRef}
              className="lightbox-video"
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            >
              <source src={lightboxItem.src} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          )}

          <div className="lightbox-caption">{lightboxItem.caption}</div>
        </div>
      )}
    </section>
  );
}