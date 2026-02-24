import React from "react"
import MediaPlayer from "./MediaPlayer"
import TextOverlay from "./TextOverlay"
import SocialIcons from "./SocialIcons"

function HeroImageBlock({ block }) {
  const maxHeight = block.maxHeight || "90dvh"

  return (
    <div
      className="relative w-full bg-black overflow-hidden"
      style={{ maxHeight }}
    >
      <img
        src={block.image}
        alt=""
        className="w-full h-full object-cover"
        style={{ maxHeight }}
      />
      <TextOverlay
        overlayStyle={block.overlayStyle}
        overlayFont={block.overlayFont}
        overlayTitle={block.overlayTitle}
        overlaySubtitle={block.overlaySubtitle}
        overlayLeft={block.overlayLeft}
        overlayRight={block.overlayRight}
        overlayColor={block.overlayColor}
        overlayLink={block.overlayLink}
      />
    </div>
  )
}

function HeroVideoBlock({ block }) {
  const maxHeight = block.maxHeight || "90dvh"
  const videoSource = block.video || block.videoFile

  return (
    <div
      className="relative w-full bg-black overflow-hidden aspect-video"
      style={{ maxHeight }}
    >
      <MediaPlayer
        video={videoSource}
        thumbnail={block.thumbnail}
        title="Video"
        playButtonText={block.playButtonText}
        className="absolute inset-0 w-full h-full"
      >
        <TextOverlay
          overlayStyle={block.overlayStyle}
          overlayFont={block.overlayFont}
          overlayTitle={block.overlayTitle}
          overlaySubtitle={block.overlaySubtitle}
          overlayLeft={block.overlayLeft}
          overlayRight={block.overlayRight}
          overlayColor={block.overlayColor}
          overlayLink={block.overlayLink}
        />
      </MediaPlayer>
    </div>
  )
}

function HeroCarouselBlock({ block }) {
  const maxHeight = block.maxHeight || "90dvh"
  const images = block.images
    ? block.images.map((item) => (typeof item === "string" ? item : item.image))
    : []
  const interval = block.interval || 4000

  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval])

  if (images.length === 0) return null

  return (
    <div
      className="relative w-full bg-black overflow-hidden"
      style={{ maxHeight }}
    >
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-linear"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === currentIndex ? 1 : 0,
            zIndex: i === currentIndex ? 2 : 1,
            maxHeight,
          }}
        />
      ))}
      <TextOverlay
        overlayStyle={block.overlayStyle}
        overlayFont={block.overlayFont}
        overlayTitle={block.overlayTitle}
        overlaySubtitle={block.overlaySubtitle}
        overlayLeft={block.overlayLeft}
        overlayRight={block.overlayRight}
        overlayColor={block.overlayColor}
        overlayLink={block.overlayLink}
      />
    </div>
  )
}

function InfoBlock({ block }) {
  const { title, projectType, year, director, description } = block
  const hasMetadata = projectType || year || director

  return (
    <div className="bg-white w-full py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        {title && (
        <h1
          className="italic text-5xl md:text-7xl mb-6 text-black"
          style={{ fontFamily: "var(--heading-font), serif" }}
        >
            {title}
          </h1>
        )}
        {hasMetadata && (
          <div className="flex flex-col md:flex-row justify-center gap-4 text-xs font-sans uppercase tracking-[0.25em] text-gray-500 mb-10">
            {projectType && <span>{projectType}</span>}
            {projectType && year && <span className="hidden md:inline">•</span>}
            {year && <span>{year}</span>}
            {year && director && <span className="hidden md:inline">•</span>}
            {director && <span>Dir. {director}</span>}
          </div>
        )}
        {description && (
          <p
            className="text-lg md:text-xl leading-relaxed text-gray-900"
            style={{ fontFamily: "var(--body-font), sans-serif" }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

function TextBlock({ block }) {
  return (
    <div className="bg-white w-full py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        {block.heading && (
        <h2
          className="italic text-3xl md:text-5xl mb-6 text-black"
          style={{ fontFamily: "var(--heading-font), serif" }}
        >
            {block.heading}
          </h2>
        )}
        {block.body && (
          <p
            className="text-lg md:text-xl leading-relaxed text-gray-900"
            style={{ fontFamily: "var(--body-font), sans-serif" }}
          >
            {block.body}
          </p>
        )}
      </div>
    </div>
  )
}

function ImageBlock({ block }) {
  return (
    <div className="w-full bg-white relative">
      <img
        src={block.image}
        alt={block.alt || ""}
        className="w-full h-auto block"
      />
      <TextOverlay
        overlayStyle={block.overlayStyle}
        overlayTitle={block.overlayTitle}
        overlaySubtitle={block.overlaySubtitle}
        overlayLeft={block.overlayLeft}
        overlayRight={block.overlayRight}
        overlayColor={block.overlayColor}
        overlayLink={block.overlayLink}
      />
      {block.caption && (
        <p className="text-center text-sm text-gray-500 py-4 px-6">
          {block.caption}
        </p>
      )}
    </div>
  )
}

function GalleryBlock({ block }) {
  const images = block.images || []
  if (images.length === 0) return null

  return (
    <div className="w-full bg-white">
      {images.map((item, i) => {
        const isString = typeof item === "string"
        const src = isString ? item : item.image
        const alt = isString ? "" : item.alt || ""

        return (
          <div key={i} className="w-full relative">
            <img
              src={src}
              alt={alt}
              className="w-full h-auto block"
            />
            {!isString && (
              <TextOverlay
                overlayStyle={item.overlayStyle}
                overlayTitle={item.overlayTitle}
                overlaySubtitle={item.overlaySubtitle}
                overlayLeft={item.overlayLeft}
                overlayRight={item.overlayRight}
                overlayColor={item.overlayColor}
                overlayLink={item.overlayLink}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function VideoBlock({ block }) {
  const videoSource = block.video || block.videoFile

  return (
    <div className="w-full bg-black">
      <div className="max-w-6xl mx-auto">
        <MediaPlayer
          video={videoSource}
          thumbnail={block.thumbnail}
          title={block.caption || "Video"}
          playButtonText={block.playButtonText}
          className="w-full"
        />
      </div>
      {block.caption && (
        <p className="text-center text-sm text-gray-400 py-4 px-6 bg-black">
          {block.caption}
        </p>
      )}
    </div>
  )
}

function FooterBlock({ block }) {
  const bgColor = block.bgColor || "#ffffff"
  const links = block.links || []
  const socialLinks = block.socialLinks || []

  return (
    <div className="w-full py-16 md:py-24 px-6" style={{ backgroundColor: bgColor }}>
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        {links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                className="font-sans uppercase text-xs tracking-[0.3em] hover:opacity-50 transition-opacity"
                style={{ color: link.color || "#000000" }}
                target={link.url.startsWith("http") ? "_blank" : "_self"}
                rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {link.text}
              </a>
            ))}
          </div>
        )}
        <SocialIcons socialLinks={socialLinks} />
      </div>
    </div>
  )
}

function ContentBlock({ block }) {
  if (!block || !block.type) return null

  switch (block.type) {
    case "heroImage":
      return <HeroImageBlock block={block} />
    case "heroVideo":
      return <HeroVideoBlock block={block} />
    case "heroCarousel":
      return <HeroCarouselBlock block={block} />
    case "info":
      return <InfoBlock block={block} />
    case "text":
      return <TextBlock block={block} />
    case "image":
      return <ImageBlock block={block} />
    case "gallery":
      return <GalleryBlock block={block} />
    case "video":
      return <VideoBlock block={block} />
    case "footer":
      return <FooterBlock block={block} />
    default:
      return null
  }
}

export default function ContentBlocks({ blocks = [] }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => (
        <ContentBlock key={index} block={block} />
      ))}
    </>
  )
}

export {
  ContentBlock,
  HeroImageBlock,
  HeroVideoBlock,
  HeroCarouselBlock,
  InfoBlock,
  TextBlock,
  ImageBlock,
  GalleryBlock,
  VideoBlock,
  FooterBlock
}
