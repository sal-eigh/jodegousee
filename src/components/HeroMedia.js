import React, { useState, useEffect, useCallback, useRef } from "react"

export default function HeroMedia({
  mode = "image",
  image,
  images = [],
  carouselInterval = 4000,
  videoSource,
  overlay = true,
  overlayOpacity = 50,
  fixed = false,
  className = ""
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const videoRef = useRef(null)

  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (mode !== "carousel" || images.length <= 1) return
    const timer = setInterval(advance, carouselInterval)
    return () => clearInterval(timer)
  }, [mode, advance, carouselInterval, images.length])

  // Force autoplay on mobile
  useEffect(() => {
    if (mode === "video" && videoRef.current) {
      const playVideo = () => {
        videoRef.current.play().catch(() => {
          // Autoplay blocked — try again on user interaction
          const handleInteraction = () => {
            videoRef.current.play()
            document.removeEventListener("touchstart", handleInteraction)
            document.removeEventListener("click", handleInteraction)
          }
          document.addEventListener("touchstart", handleInteraction, { once: true })
          document.addEventListener("click", handleInteraction, { once: true })
        })
      }
      playVideo()
    }
  }, [mode])

  const positionClass = fixed ? "fixed inset-0" : "relative"
  const baseClass = `w-full h-full bg-black overflow-hidden ${positionClass} ${className}`

  if (mode === "image" && image) {
    return (
      <div className={baseClass}>
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {overlay && (
          <div
            className="absolute inset-0 bg-black z-[1]"
            style={{ opacity: overlayOpacity / 100 }}
          />
        )}
      </div>
    )
  }

  if (mode === "carousel" && images.length > 0) {
    return (
      <div className={baseClass}>
        {images.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-linear"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === currentIndex ? 1 : 0,
              zIndex: i === currentIndex ? 2 : 1,
            }}
          />
        ))}
        {overlay && (
          <div
            className="absolute inset-0 bg-black z-[3]"
            style={{ opacity: overlayOpacity / 100 }}
          />
        )}
      </div>
    )
  }

  if (mode === "video" && videoSource) {
    return (
      <div className={baseClass}>
      <video
        ref={videoRef}
        src={videoSource}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <track kind="captions" />
      </video>
        {overlay && (
          <div
            className="absolute inset-0 bg-black z-[1]"
            style={{ opacity: overlayOpacity / 100 }}
          />
        )}
      </div>
    )
  }

  return <div className={baseClass} />
}
