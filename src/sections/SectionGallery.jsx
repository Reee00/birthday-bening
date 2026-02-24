import React, { useEffect, useState, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// Data gallery — field `poster` DIHAPUS dari video,
// thumbnail akan di-generate otomatis dari first frame video
// ─────────────────────────────────────────────────────────────
const gallery = [
  // 📸 PHOTOS
<<<<<<< HEAD
  { type: "photo", src: "/photos/A_moment_intime.webp",      caption: "A moment in time" },
  { type: "photo", src: "/photos/Jusustwo.webp",             caption: "Just us two" },
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
=======
  { type: "photo", src: "/photos/A_moment_intime.webp",   caption: "A moment in time" },
  { type: "photo", src: "/photos/Jususttwo.webp",          caption: "Just us two" },
  { type: "photo", src: "/photos/smilesandstars.webp",     caption: "Smiles & stars" },
  { type: "photo", src: "/photos/goldenhour.webp",         caption: "Golden hour" },
  { type: "photo", src: "/photos/alwaysforever.webp",      caption: "Always & forever" },
  { type: "photo", src: "/photos/Yourbeautiful.webp",      caption: "Your beautiful smile" },
  { type: "photo", src: "/photos/adventurestogether.webp", caption: "Adventures together" },
  { type: "photo", src: "/photos/ngejamu.webp",            caption: "Nge Jamu" },
  { type: "photo", src: "/photos/dancelikenobodys.webp",   caption: "Dance like nobody's watching" },
  { type: "photo", src: "/photos/ngelancong.webp",         caption: "Ngelancong" },
  { type: "photo", src: "/photos/coffedate.webp",          caption: "Coffee date" },
  { type: "photo", src: "/photos/homemadecoffee.webp",     caption: "Home Made Coffee" },
  { type: "photo", src: "/photos/Rainydaycuddies.webp",    caption: "Rainy Day Cuddles" },
  { type: "photo", src: "/photos/canditmoments.webp",      caption: "Candid moments" },
  { type: "photo", src: "/photos/NightWalks.webp",         caption: "Night walks" },
  { type: "photo", src: "/photos/wintervibes.webp",        caption: "Winter vibes" },
  { type: "photo", src: "/photos/sicantik.webp",           caption: "Si Cantik" },
  { type: "photo", src: "/photos/lastdayofyear.webp",      caption: "Last day of year" },
>>>>>>> 31397ce (update path)

  // 🎥 VIDEOS — tidak perlu field poster, diambil otomatis dari first frame
  { type: "video", src: "/videos/video1.mp4", caption: "Our love story" },
  { type: "video", src: "/videos/video2.mp4", caption: "Dinner Date" },
  { type: "video", src: "/videos/video3.mp4", caption: "Funny moments" },
  { type: "video", src: "/videos/video4.mp4", caption: "Birthday wishes" },
];

// ─────────────────────────────────────────────────────────────
// Hook: useVideoThumbnail
//
// Cara kerja:
// 1. Buat elemen <video> tersembunyi di luar DOM (tidak perlu di-render)
// 2. Set crossOrigin = "anonymous" agar canvas bisa drawImage (hindari taint)
// 3. Set src + preload="metadata" → browser cukup load header video saja
// 4. Saat event `loadeddata` / `seeked` terpanggil dan readyState >= 2
//    (HAVE_CURRENT_DATA), video sudah punya frame pertama di buffer
// 5. drawImage ke canvas, lalu canvas.toDataURL() → base64 PNG → simpan ke state
// 6. Cleanup: cabut src agar browser stop download
//
// Catatan penting:
// - Video harus served dari origin yang sama ATAU dengan header
//   Access-Control-Allow-Origin: * agar canvas tidak ter-taint
// - Safari kadang butuh `muted` agar autoplay/seek diizinkan
// ─────────────────────────────────────────────────────────────
function useVideoThumbnail(src) {
  const [thumbnail, setThumbnail] = useState(null); // base64 data URL
  const [status,    setStatus]    = useState("idle"); // idle | loading | done | error

  useEffect(() => {
    if (!src) return;

    setStatus("loading");
    setThumbnail(null);

    // Buat elemen video & canvas di luar DOM (tidak di-render ke UI)
    const video  = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx    = canvas.getContext("2d");

    // ── Konfigurasi video ──────────────────────────────────────
    video.crossOrigin = "anonymous"; // wajib agar canvas tidak tainted
    video.muted       = true;        // beberapa browser blokir seek tanpa muted
    video.preload     = "metadata";  // cukup metadata + beberapa frame pertama
    video.playsInline = true;
    // currentTime = 0.001 lebih andal daripada 0 di beberapa browser
    video.currentTime = 0.001;

    // ── Capture frame saat video siap ─────────────────────────
    const captureFrame = () => {
      // readyState 2 = HAVE_CURRENT_DATA (frame pertama tersedia)
      if (video.readyState < 2) return;

      try {
        canvas.width  = video.videoWidth  || 320;
        canvas.height = video.videoHeight || 180;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL("image/jpeg", 0.8); // JPEG 80% lebih kecil dari PNG
        setThumbnail(dataURL);
        setStatus("done");
      } catch (err) {
        // Canvas tainted (CORS) atau video format tidak didukung
        console.warn("[useVideoThumbnail] Gagal capture frame:", err.message);
        setStatus("error");
      } finally {
        // Cleanup: stop download video
        video.src = "";
        video.load();
      }
    };

    // ── Event listeners ────────────────────────────────────────
    // `loadeddata` = frame pertama sudah di-decode
    video.addEventListener("loadeddata", captureFrame, { once: true });
    // `seeked` = fallback jika `loadeddata` tidak trigger capture
    video.addEventListener("seeked",      captureFrame, { once: true });
    video.addEventListener("error", () => {
      console.warn("[useVideoThumbnail] Error load video:", src);
      setStatus("error");
      video.src = "";
    }, { once: true });

    // ── Start load ─────────────────────────────────────────────
    video.src = src;
    video.load();

    // ── Cleanup saat komponen unmount / src berubah ────────────
    return () => {
      video.removeEventListener("loadeddata", captureFrame);
      video.removeEventListener("seeked",      captureFrame);
      video.src = "";
      video.load(); // reset & hentikan download
    };
  }, [src]);

  return { thumbnail, status };
}

// ─────────────────────────────────────────────────────────────
// Komponen kecil: VideoThumbnail
// Menampilkan thumbnail + loading/error state
// Di-extract sebagai komponen agar setiap video punya hook sendiri
// (hooks tidak boleh dipanggil di dalam loop)
// ─────────────────────────────────────────────────────────────
function VideoThumbnail({ src, alt, className }) {
  const { thumbnail, status } = useVideoThumbnail(src);

  if (status === "loading" || status === "idle") {
    // Skeleton loading placeholder
    return (
      <div
        className={`video-thumb-skeleton ${className ?? ""}`}
        aria-label="Memuat thumbnail..."
        style={{
          background: "linear-gradient(135deg, #1a0a30, #2a0a4a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <span style={{ fontSize: "1.4rem", opacity: 0.4 }}>🎥</span>
      </div>
    );
  }

  if (status === "error" || !thumbnail) {
    // Fallback jika CORS atau format tidak didukung
    return (
      <div
        className={`video-thumb-fallback ${className ?? ""}`}
        aria-label={alt}
        style={{
          background: "linear-gradient(135deg, #1a0a30, #2a0a4a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <span style={{ fontSize: "1.8rem" }}>🎥</span>
      </div>
    );
  }

  // Thumbnail berhasil di-generate dari first frame
  return (
    <img
      src={thumbnail}
      alt={alt}
      className={className}
      draggable={false}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Komponen utama
// ─────────────────────────────────────────────────────────────
export default function SectionGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [autoPlay,     setAutoPlay]     = useState(true);
  const [filterType,   setFilterType]   = useState("all");
  const [playingIdx,   setPlayingIdx]   = useState(null);

  const autoPlayTimerRef = useRef(null);
  const resumeTimerRef   = useRef(null);
  const thumbnailsRef    = useRef(null);
  const lightboxVideoRef = useRef(null);
  const videoRefs        = useRef({}); // Map: idx → <video> DOM element

  // ─── filtered list ──────────────────────────────────────────
  const filteredGallery =
    filterType === "all"
      ? gallery
      : gallery.filter((item) => item.type === filterType);

  const photoCount = gallery.filter((i) => i.type === "photo").length;
  const videoCount = gallery.filter((i) => i.type === "video").length;

  // ─── auto-play ──────────────────────────────────────────────
  useEffect(() => {
    clearInterval(autoPlayTimerRef.current);
    if (!autoPlay || playingIdx !== null) return;
    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
    }, 5000);
    return () => clearInterval(autoPlayTimerRef.current);
  }, [autoPlay, playingIdx, filteredGallery.length]);

  // Pause semua inline video saat slide berganti
  useEffect(() => {
    Object.values(videoRefs.current).forEach((v) => { if (v && !v.paused) v.pause(); });
    setPlayingIdx(null);
  }, [currentIndex]);

  // Scroll thumbnail aktif ke tengah
  useEffect(() => {
    thumbnailsRef.current
      ?.querySelector(".carousel-thumbnail.active")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [currentIndex]);

  // ─── helpers ────────────────────────────────────────────────
  const pauseResume = useCallback(() => {
    setAutoPlay(false);
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setAutoPlay(true), 12000);
  }, []);

  const goToSlide    = useCallback((i) => { setCurrentIndex(i); pauseResume(); }, [pauseResume]);
  const goToPrevious = useCallback(() => {
    setCurrentIndex((p) => (p - 1 + filteredGallery.length) % filteredGallery.length);
    pauseResume();
  }, [filteredGallery.length, pauseResume]);
  const goToNext = useCallback(() => {
    setCurrentIndex((p) => (p + 1) % filteredGallery.length);
    pauseResume();
  }, [filteredGallery.length, pauseResume]);

  // ─── keyboard ───────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (lightboxOpen) { if (e.key === "Escape") closeLightbox(); return; }
      if (e.key === "ArrowLeft")  goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goToPrevious, goToNext]);

  // ─── swipe ──────────────────────────────────────────────────
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? goToNext() : goToPrevious();
    touchStartX.current = null;
  };

  // ─── inline video play/pause ────────────────────────────────
  const handleInlineVideoClick = useCallback((e, idx) => {
    e.stopPropagation();
    const vid = videoRefs.current[idx];
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
      setPlayingIdx(idx);
      pauseResume();
    } else {
      vid.pause();
      setPlayingIdx(null);
    }
  }, [pauseResume]);

  // ─── lightbox ───────────────────────────────────────────────
  const openLightbox = useCallback((item) => {
    Object.values(videoRefs.current).forEach((v) => { if (v) v.pause(); });
    setPlayingIdx(null);
    setAutoPlay(false);
    setLightboxItem(item);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

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

  // ─── filter change ──────────────────────────────────────────
  const changeFilter = (type) => {
    Object.values(videoRefs.current).forEach((v) => { if (v) v.pause(); });
    setPlayingIdx(null);
    setFilterType(type);
    setCurrentIndex(0);
  };

  // ─── render ─────────────────────────────────────────────────
  return (
    <section className="gallery-section">
      <div className="section-divider" />
      <div className="section-label reveal-up" style={{ marginTop: "1.5rem" }}>
        Our memories
      </div>
      <h2 className="section-heading reveal-zoom">
        A Glimpse of <em>Us</em>
      </h2>

      <div className="carousel-wrapper">

        {/* Filter */}
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
                key={`slide-${item.src}`}
                className={`carousel-slide ${idx === currentIndex ? "active" : ""}`}
                aria-hidden={idx !== currentIndex}
              >
                <div className="carousel-image-wrapper">
                  {item.type === "photo" ? (
                    <img
                      src={item.src}
                      alt={item.caption}
                      className="carousel-image"
                      loading={Math.abs(idx - currentIndex) <= 1 ? "eager" : "lazy"}
                      onClick={() => openLightbox(item)}
                    />
                  ) : (
                    <div className="carousel-video-wrapper">
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current[idx] = el;
                          else    delete videoRefs.current[idx];
                        }}
                        className="carousel-video"
                        playsInline
                        preload="metadata"
                        // poster TIDAK diset di sini — first frame otomatis
                        // tampil karena preload="metadata" + currentTime default 0
                        onClick={(e) => handleInlineVideoClick(e, idx)}
                        onEnded={() => setPlayingIdx(null)}
                        onPause={() => setPlayingIdx(null)}
                        onPlay={()  => setPlayingIdx(idx)}
                      >
                        <source src={item.src} type="video/mp4" />
                      </video>

                      {playingIdx !== idx && (
                        <div
                          className="video-play-icon"
                          onClick={(e) => handleInlineVideoClick(e, idx)}
                          role="button"
                          aria-label="Putar video"
                          tabIndex={idx === currentIndex ? 0 : -1}
                        >
                          <div className="play-button">▶</div>
                        </div>
                      )}

                      <button
                        className="video-fullscreen-btn"
                        onClick={() => openLightbox(item)}
                        aria-label="Buka fullscreen"
                      >
                        ⛶
                      </button>
                    </div>
                  )}

                  <div className="carousel-type-badge" aria-hidden="true">
                    {item.type === "photo" ? "📸" : "🎥"}
                  </div>

                  <div className="carousel-overlay">
                    <div className="carousel-info">
                      <h3 className="carousel-caption">{item.caption}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-btn carousel-btn-prev" onClick={goToPrevious} aria-label="Previous">❮</button>
          <button className="carousel-btn carousel-btn-next" onClick={goToNext}     aria-label="Next">❯</button>

          <button
            className="carousel-play-btn"
            onClick={() => { setAutoPlay((p) => !p); clearTimeout(resumeTimerRef.current); }}
            aria-label={autoPlay ? "Pause slideshow" : "Play slideshow"}
          >
            {autoPlay ? "⏸" : "▶"}
          </button>
        </div>

        <div className="carousel-counter" aria-live="polite">
          {currentIndex + 1} / {filteredGallery.length}
        </div>

        {/* ── THUMBNAILS ────────────────────────────────────────
            VideoThumbnail di-render sebagai komponen terpisah
            agar setiap video bisa punya hook useVideoThumbnail
            sendiri — hooks tidak boleh dipanggil di dalam loop
        ── */}
        <div className="carousel-thumbnails-wrapper">
          <div className="carousel-thumbnails" ref={thumbnailsRef}>
            {filteredGallery.map((item, idx) => (
              <button
                key={`thumb-${item.src}`}
                className={`carousel-thumbnail ${idx === currentIndex ? "active" : ""}`}
                onClick={() => goToSlide(idx)}
                aria-label={item.caption}
                title={item.caption}
              >
                {item.type === "photo" ? (
                  <img src={item.src} alt={item.caption} loading="lazy" />
                ) : (
                  <>
                    {/*
                      VideoThumbnail secara otomatis:
                      1. Load metadata video di background
                      2. Seek ke frame 0.001s
                      3. drawImage ke <canvas>
                      4. canvas.toDataURL() → tampilkan sebagai <img>
                    */}
                    <VideoThumbnail
                      src={item.src}
                      alt={item.caption}
                      className="video-thumb-img"
                    />
                    <div className="video-badge-small" aria-hidden="true">🎥</div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dots / Progress bar */}
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
            <div className="carousel-progress">
              <div
                className="progress-bar-fill"
                style={{ width: `${((currentIndex + 1) / filteredGallery.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── LIGHTBOX ────────────────────────────────────────── */}
      {lightboxOpen && lightboxItem && (
        <div
          className="lightbox open"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.caption}
        >
          <button className="lightbox-close" aria-label="Close" onClick={closeLightbox}>
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
            <video
              ref={lightboxVideoRef}
              className="lightbox-video"
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            >
              <source src={lightboxItem.src} type="video/mp4" />
            </video>
          )}

          <div className="lightbox-caption">{lightboxItem.caption}</div>
        </div>
      )}
    </section>
  );
}
