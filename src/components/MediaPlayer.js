import React, { useState, useRef, useEffect } from "react"

function parseVideoSource(source) {
  if (!source) return null

  const trimmed = source.trim()

  if (trimmed.startsWith("/") || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return { type: "file", url: trimmed }
  }

  if (trimmed.includes("player.vimeo.com/video/")) {
    const match = trimmed.match(/player\.vimeo\.com\/video\/(\d+)(?:.*h=([a-zA-Z0-9]+))?/)
    if (match) {
      return { type: "vimeo", id: match[1], hash: match[2] || null }
    }
    return { type: "embed", url: trimmed }
  }

  if (trimmed.includes("youtube.com/embed/")) {
    const match = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
    if (match) {
      return { type: "youtube", id: match[1] }
    }
    return { type: "embed", url: trimmed }
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/)
  if (vimeoMatch) {
    return { type: "vimeo", id: vimeoMatch[1], hash: vimeoMatch[2] || null }
  }

  const youtubeWatchMatch = trimmed.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/)
  if (youtubeWatchMatch) {
    return { type: "youtube", id: youtubeWatchMatch[1] }
  }

  const youtubeShortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (youtubeShortMatch) {
    return { type: "youtube", id: youtubeShortMatch[1] }
  }

  if (trimmed.startsWith("http")) {
    return { type: "embed", url: trimmed }
  }

  return null
}

function buildEmbedUrl(parsed, autoplay = true) {
  if (!parsed) return null

  const autoplayParam = autoplay ? 1 : 0

  switch (parsed.type) {
    case "vimeo":
      const hashParam = parsed.hash ? `h=${parsed.hash}&` : ""
      return `https://player.vimeo.com/video/${parsed.id}?${hashParam}autoplay=${autoplayParam}&title=0&byline=0&portrait=0`

    case "youtube":
      return `https://www.youtube.com/embed/${parsed.id}?autoplay=${autoplayParam}&rel=0`

    case "embed":
      if (autoplay && !parsed.url.includes("autoplay")) {
        const separator = parsed.url.includes("?") ? "&" : "?"
        return `${parsed.url}${separator}autoplay=1`
      }
      return parsed.url

    case "file":
      return parsed.url

    default:
      return null
  }
}

/**
 * MediaPlayer Component
 *
 * Props:
 * - video: video URL
 * - thumbnail: poster image
 * - title: for accessibility
 * - playButtonText: text under play icon (null/undefined = no text, empty string = no text)
 * - autoplay: start immediately
 * - showPlayButton: show play button overlay
 * - className: wrapper class
 * - children: additional content rendered on top
 */
export default function MediaPlayer({
  video,
  thumbnail,
  title = "Video",
  playButtonText,
  autoplay = false,
  showPlayButton = true,
  className = "",
  children
}) {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const videoRef = useRef(null)

  const parsed = parseVideoSource(video)
  const embedUrl = buildEmbedUrl(parsed, true)
  const isFileVideo = parsed?.type === "file"

  useEffect(() => {
    if (isPlaying && isFileVideo && videoRef.current) {
      videoRef.current.play()
    }
  }, [isPlaying, isFileVideo])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  if (!parsed && !thumbnail) {
    return (
      <div className={`relative bg-black overflow-hidden aspect-video ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
          No media
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-black overflow-hidden aspect-video ${className}`}>
      {/* Thumbnail */}
      {!isPlaying && thumbnail && (
        <img
          src={thumbnail}
          alt={`${title} thumbnail`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* File video */}
      {isPlaying && isFileVideo && (
      <video
        ref={videoRef}
        src={embedUrl}
        className="absolute inset-0 w-full h-full object-cover"
        controls
        autoPlay
        title={title}
      >
        <track kind="captions" />
      </video>
      )}

      {/* Embed video */}
      {isPlaying && !isFileVideo && embedUrl && (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-none"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
        />
      )}

      {/* Play button overlay */}
      {!isPlaying && showPlayButton && parsed && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-500 hover:bg-black/20"
          aria-label={`Play ${title}`}
        >
          <div className="w-0 h-0 border-t-[20px] border-t-transparent border-l-[40px] border-l-white border-b-[20px] border-b-transparent ml-1 hover:scale-110 transition-transform" />
          {playButtonText && (
            <span className="mt-4 text-xs font-sans uppercase tracking-widest text-white">
              {playButtonText}
            </span>
          )}
        </button>
      )}

      {/* Thumbnail only (no video) */}
      {!isPlaying && !parsed && thumbnail && (
        <img
          src={thumbnail}
          alt={`${title}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Children rendered on top */}
      {children}
    </div>
  )
}

export { parseVideoSource, buildEmbedUrl }
