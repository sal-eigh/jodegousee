import React from "react"

export default function TextOverlay({
  overlayStyle,
  overlayTitle,
  overlaySubtitle,
  overlayLeft,
  overlayRight,
  overlayColor = "#ffffff",
  overlayLink,
  overlayFont,
}) {
  if (!overlayStyle || overlayStyle === "none") return null

  const color = overlayColor || "#ffffff"
  const fontFamily = overlayFont
    ? `"${overlayFont}", var(--heading-font), cursive`
    : "var(--heading-font), cursive"

  const titleElement = overlayLink ? (
    <a
      href={overlayLink}
      className="hover:opacity-70 transition-opacity"
      target={overlayLink.startsWith("http") ? "_blank" : "_self"}
      rel={overlayLink.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{ color }}
    >
      {overlayTitle}
    </a>
  ) : (
    overlayTitle
  )

  if (overlayStyle.startsWith("title-subtitle")) {
    let positionClasses = ""
    let alignClasses = ""

    switch (overlayStyle) {
      case "title-subtitle-tl":
        positionClasses = "top-0 left-0 p-6 md:p-10 pt-20 md:pt-24"
        alignClasses = "items-start text-left"
        break
      case "title-subtitle-tc":
        positionClasses = "top-0 left-0 right-0 p-6 md:p-10 pt-20 md:pt-24"
        alignClasses = "items-center text-center"
        break
      case "title-subtitle-tr":
        positionClasses = "top-0 right-0 p-6 md:p-10 pt-20 md:pt-24"
        alignClasses = "items-end text-right"
        break
      case "title-subtitle-c":
        positionClasses = "inset-0"
        alignClasses = "items-center justify-center text-center"
        break
      case "title-subtitle-bl":
        positionClasses = "bottom-0 left-0 p-6 md:p-10"
        alignClasses = "items-start text-left"
        break
      case "title-subtitle-bc":
        positionClasses = "bottom-0 left-0 right-0 p-6 md:p-10"
        alignClasses = "items-center text-center"
        break
      case "title-subtitle-br":
        positionClasses = "bottom-0 right-0 p-6 md:p-10"
        alignClasses = "items-end text-right"
        break
      default:
        positionClasses = "bottom-0 left-0 p-6 md:p-10"
        alignClasses = "items-start text-left"
        break
    }

    return (
      <div
        className={`absolute z-[5] flex flex-col pointer-events-none ${positionClasses} ${alignClasses}`}
      >
        {overlayTitle && (
          <span
            className="text-2xl md:text-4xl lg:text-5xl drop-shadow-md pointer-events-auto"
            style={{ color, fontFamily }}
          >
            {titleElement}
          </span>
        )}
        {overlaySubtitle && (
          <span
            className="text-xs md:text-sm uppercase tracking-[0.2em] mt-2 drop-shadow-md"
            style={{ color, opacity: 0.8, fontFamily: "var(--subtitle-font, var(--body-font)), sans-serif" }}
          >
            {overlaySubtitle}
          </span>
        )}
      </div>
    )
  }

  if (overlayStyle.startsWith("two-col")) {
    let positionStyle = {}

    switch (overlayStyle) {
      case "two-col-top":
        positionStyle = { top: "24px", left: 0, right: 0, paddingTop: "48px" }
        break
      case "two-col-center":
        positionStyle = { top: "25%", bottom: "25%", left: 0, right: 0 }
        break
      case "two-col-bottom":
        positionStyle = { bottom: "24px", left: 0, right: 0 }
        break
      default:
        positionStyle = { bottom: "24px", left: 0, right: 0 }
        break
    }

    const alignItems = overlayStyle === "two-col-center" ? "center" : "flex-start"
    const bodyFontFamily = "var(--body-font), sans-serif"

    return (
      <div
        className="absolute z-[5] flex justify-between px-6 md:px-10 pointer-events-none"
        style={{ ...positionStyle, display: "flex", alignItems }}
      >
        {overlayLeft && (
          <div
            className="text-xs md:text-sm leading-relaxed whitespace-pre-line drop-shadow-md max-w-[45%]"
            style={{ color, fontFamily: bodyFontFamily }}
          >
            {overlayLeft}
          </div>
        )}
        {overlayRight && (
          <div
            className="text-xs md:text-sm leading-relaxed whitespace-pre-line text-right drop-shadow-md max-w-[45%]"
            style={{ color, fontFamily: bodyFontFamily }}
          >
            {overlayRight}
          </div>
        )}
      </div>
    )
  }

  return null
}
