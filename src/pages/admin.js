import React, { useEffect } from "react"
import ReactMarkdown from 'react-markdown'

const AdminPage = () => {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"
    script.onload = () => {
      const CMS = window.CMS

      // -----------------------------------------------
      // SHARED HELPERS
      // -----------------------------------------------

      // Simple markdown to HTML converter
      const parseMarkdown = (md) => {
        if (!md) return ""
        let html = md
        // Headers
        html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
        html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
        html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
        html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
        html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
        html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
        // Bold and italic
        html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        // Line breaks and paragraphs
        html = html.replace(/\n{2,}/g, '</p><p>')
        html = html.replace(/\n/g, '<br />')
        html = `<p>${html}</p>`
        // Clean empty paragraphs
        html = html.replace(/<p>\s*<\/p>/g, '')
        return html
      }

      const overlayStyleLabels = {
        "none": "None",
        "title-subtitle-tl": "Title+Sub (Top Left)",
        "title-subtitle-tc": "Title+Sub (Top Center)",
        "title-subtitle-tr": "Title+Sub (Top Right)",
        "title-subtitle-c": "Title+Sub (Center)",
        "title-subtitle-bl": "Title+Sub (Bottom Left)",
        "title-subtitle-bc": "Title+Sub (Bottom Center)",
        "title-subtitle-br": "Title+Sub (Bottom Right)",
        "two-col-top": "Two Col (Top)",
        "two-col-center": "Two Col (Center)",
        "two-col-bottom": "Two Col (Bottom)",
      }

      const debugLabel = (text) => (
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "8px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding: "4px 8px",
            fontSize: "10px",
            borderRadius: "3px",
            fontFamily: "monospace",
            zIndex: 10,
          }}
        >
          {text}
        </div>
      )

      const renderOverlayPreview = (block) => {
        const style = block.overlayStyle
        if (!style || style === "none") return null

        const color = block.overlayColor || "#ffffff"

        if (style.startsWith("title-subtitle")) {
          let containerStyle = { position: "absolute", zIndex: 5, display: "flex", flexDirection: "column" }

          switch (style) {
            case "title-subtitle-tl":
              Object.assign(containerStyle, { top: "48px", left: "24px", alignItems: "flex-start" })
              break
            case "title-subtitle-tc":
              Object.assign(containerStyle, { top: "48px", left: 0, right: 0, alignItems: "center", textAlign: "center" })
              break
            case "title-subtitle-tr":
              Object.assign(containerStyle, { top: "48px", right: "24px", alignItems: "flex-end", textAlign: "right" })
              break
            case "title-subtitle-c":
              Object.assign(containerStyle, { inset: 0, alignItems: "center", justifyContent: "center", textAlign: "center" })
              break
            case "title-subtitle-bl":
              Object.assign(containerStyle, { bottom: "24px", left: "24px", alignItems: "flex-start" })
              break
            case "title-subtitle-bc":
              Object.assign(containerStyle, { bottom: "24px", left: 0, right: 0, alignItems: "center", textAlign: "center" })
              break
            case "title-subtitle-br":
              default:
                Object.assign(containerStyle, { bottom: "24px", right: "24px", alignItems: "flex-end", textAlign: "right" })
              break
          }

          return (
            <div style={containerStyle}>
              {block.overlayTitle && (
                <span style={{ color, fontSize: "32px", fontFamily: "serif", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  {block.overlayTitle}
                  {block.overlayLink && <span style={{ fontSize: "10px", opacity: 0.5, marginLeft: "6px" }}>[link]</span>}
                </span>
              )}
              {block.overlaySubtitle && (
                <span style={{ color, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", marginTop: "8px", opacity: 0.8, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  {block.overlaySubtitle}
                </span>
              )}
            </div>
          )
        }

        if (style.startsWith("two-col")) {
          let posStyle = { position: "absolute", left: 0, right: 0, zIndex: 5, display: "flex", justifyContent: "space-between", padding: "0 24px" }

          switch (style) {
            case "two-col-top":
              Object.assign(posStyle, { top: "48px", alignItems: "flex-start" })
              break
            case "two-col-center":
              Object.assign(posStyle, { top: "25%", bottom: "25%", alignItems: "center" })
              break
            case "two-col-bottom":
              default:
                Object.assign(posStyle, { bottom: "24px", alignItems: "flex-start" })
              break
          }

          return (
            <div style={posStyle}>
              {block.overlayLeft && (
                <div style={{ color, fontSize: "11px", lineHeight: "1.6", whiteSpace: "pre-line", maxWidth: "45%", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  {block.overlayLeft}
                </div>
              )}
              {block.overlayRight && (
                <div style={{ color, fontSize: "11px", lineHeight: "1.6", whiteSpace: "pre-line", textAlign: "right", maxWidth: "45%", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  {block.overlayRight}
                </div>
              )}
            </div>
          )
        }

        return null
      }

      // -----------------------------------------------
      // BLOCK PREVIEW RENDERER
      // -----------------------------------------------

      const previewBlock = (block, getAsset) => {
        if (!block || !block.type) return null

        // Hero Image
        if (block.type === "heroImage") {
          const img = getAsset(block.image)
          return (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", backgroundColor: "#000", overflow: "hidden" }}>
              {img && <img src={img.toString()} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />}
              {renderOverlayPreview(block)}
              {debugLabel(`Hero Image | Max: ${block.maxHeight || "90dvh"} | Overlay: ${overlayStyleLabels[block.overlayStyle] || "None"}`)}
            </div>
          )
        }

        // Hero Video
        if (block.type === "heroVideo") {
          const thumb = getAsset(block.thumbnail)
          return (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", backgroundColor: "#000", overflow: "hidden" }}>
              {thumb && <img src={thumb.toString()} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />}
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
                <div style={{ width: 0, height: 0, borderTop: "20px solid transparent", borderLeft: "40px solid white", borderBottom: "20px solid transparent" }} />
                {block.playButtonText && (
                  <span style={{ marginTop: "16px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff" }}>
                    {block.playButtonText}
                  </span>
                )}
              </div>
              {renderOverlayPreview(block)}
              {debugLabel(`Hero Video | ${block.video || block.videoFile || "No source"} | Overlay: ${overlayStyleLabels[block.overlayStyle] || "None"}`)}
            </div>
          )
        }

        // Hero Carousel
        if (block.type === "heroCarousel") {
          const images = block.images || []
          const firstImage = images.length > 0 ? getAsset(images[0]?.image || images[0]) : null
          return (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", backgroundColor: "#000", overflow: "hidden" }}>
              {firstImage && <img src={firstImage.toString()} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />}
              {renderOverlayPreview(block)}
              {debugLabel(`Carousel | ${images.length} images | Overlay: ${overlayStyleLabels[block.overlayStyle] || "None"}`)}
            </div>
          )
        }

        // Info Block
        if (block.type === "info") {
          return (
            <div style={{ padding: "96px 24px", textAlign: "center", maxWidth: "768px", margin: "0 auto", backgroundColor: "#fff" }}>
              {block.title && <h1 style={{ fontFamily: "serif", fontStyle: "italic", fontSize: "48px", marginBottom: "24px", color: "#000" }}>{block.title}</h1>}
              {(block.projectType || block.year || block.director) && (
                <div style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280", marginBottom: "40px" }}>
                  {block.projectType && <span>{block.projectType}</span>}
                  {block.projectType && block.year && <span>•</span>}
                  {block.year && <span>{block.year}</span>}
                  {block.year && block.director && <span>•</span>}
                  {block.director && <span>Dir. {block.director}</span>}
                </div>
              )}
              {block.description && <p style={{ fontFamily: "serif", fontSize: "18px", lineHeight: "1.75", color: "#111" }}>{block.description}</p>}
            </div>
          )
        }

        // Text Block
        if (block.type === "text") {
          return (
            <div style={{ padding: "64px 24px", textAlign: "center", maxWidth: "768px", margin: "0 auto", backgroundColor: "#fff" }}>
              {block.heading && <h2 style={{ fontFamily: "serif", fontStyle: "italic", fontSize: "36px", marginBottom: "24px", color: "#000" }}>{block.heading}</h2>}
              {block.body && <p style={{ fontFamily: "serif", fontSize: "18px", lineHeight: "1.75", color: "#111" }}>{block.body}</p>}
            </div>
          )
        }

        // Image Block
        if (block.type === "image") {
          const img = getAsset(block.image)
          return (
            <div style={{ width: "100%", backgroundColor: "#fff", position: "relative" }}>
              {img && <img src={img.toString()} alt={block.alt || ""} style={{ width: "100%", height: "auto", display: "block" }} />}
              {renderOverlayPreview(block)}
              {block.caption && <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", padding: "16px" }}>{block.caption}</p>}
            </div>
          )
        }

        // Gallery Block
        if (block.type === "gallery" && block.images) {
          return (
            <div style={{ width: "100%", backgroundColor: "#fff" }}>
              {block.images.map((item, i) => {
                const img = getAsset(item.image || item)
                return (
                  <div key={i} style={{ position: "relative", width: "100%" }}>
                    {img && <img src={img.toString()} alt={item.alt || ""} style={{ width: "100%", height: "auto", display: "block" }} />}
                    {item.overlayStyle && renderOverlayPreview(item)}
                  </div>
                )
              })}
            </div>
          )
        }

        // Video Block
        if (block.type === "video") {
          const thumb = getAsset(block.thumbnail)
          return (
            <div style={{ width: "100%", backgroundColor: "#000", padding: "24px" }}>
              <div style={{ maxWidth: "1024px", margin: "0 auto", aspectRatio: "16/9", backgroundColor: "#111", position: "relative" }}>
                {thumb && <img src={thumb.toString()} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />}
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 0, height: 0, borderTop: "20px solid transparent", borderLeft: "40px solid white", borderBottom: "20px solid transparent" }} />
                  {block.playButtonText && (
                    <span style={{ marginTop: "16px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff" }}>
                      {block.playButtonText}
                    </span>
                  )}
                </div>
                {debugLabel(`Video | ${block.video || block.videoFile || "No source"}`)}
              </div>
              {block.caption && <p style={{ textAlign: "center", fontSize: "14px", color: "#9ca3af", padding: "16px" }}>{block.caption}</p>}
            </div>
          )
        }

        // Footer Block
        if (block.type === "footer") {
          const bgColor = block.bgColor || "#ffffff"
          const links = block.links || []
          const socialLinks = block.socialLinks || []

          return (
            <div style={{ backgroundColor: bgColor, padding: "64px 24px" }}>
              <div style={{ maxWidth: "768px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
                {links.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px" }}>
                    {links.map((link, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.3em",
                          color: link.color || "#000000",
                          fontFamily: "sans-serif",
                        }}
                      >
                        {link.text}
                      </span>
                    ))}
                  </div>
                )}
                {socialLinks.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                    {socialLinks.map((social, i) => (
                      <div
                        key={i}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: social.color || "#000000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ color: "#fff", fontSize: "9px", fontWeight: "bold" }}>
                          {(social.platform || "?").charAt(0).toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {links.length === 0 && socialLinks.length === 0 && (
                  <span style={{ color: "#999", fontSize: "14px" }}>
                    Empty footer block. Add links or social icons.
                  </span>
                )}
              </div>
            </div>
          )
        }

        return null
      }

      // -----------------------------------------------
      // FILMS PREVIEW
      // -----------------------------------------------
      CMS.registerPreviewTemplate("films", ({ entry, getAsset }) => {
        const blocks = entry.getIn(["data", "blocks"])
        const blocksList = blocks ? blocks.toJS() : []

        return (
          <div style={{ backgroundColor: "#fff" }}>
            {blocksList.map((block, index) => (
              <div key={index}>{previewBlock(block, getAsset)}</div>
            ))}
            {blocksList.length === 0 && (
              <div style={{ padding: "96px 24px", textAlign: "center", color: "#999", fontSize: "16px" }}>
                No content blocks added yet.
              </div>
            )}
          </div>
        )
      })

      // -----------------------------------------------
      // MUSIC VIDEO PREVIEW
      // -----------------------------------------------
      CMS.registerPreviewTemplate("music-video", ({ entry, getAsset }) => {
        const title = entry.getIn(["data", "title"]) || ""
        const artist = entry.getIn(["data", "artist"]) || ""
        const thumbnail = getAsset(entry.getIn(["data", "thumbnail"]))
        const video = entry.getIn(["data", "video"]) || ""
        const videoFile = entry.getIn(["data", "videoFile"]) || ""
        const playButtonText = entry.getIn(["data", "playButtonText"]) || ""
        const credits = entry.getIn(["data", "credits"])
        const creditsList = credits ? credits.toJS() : []

        return (
          <div style={{ display: "flex", gap: "32px", padding: "24px", backgroundColor: "#fff" }}>
            <div style={{ width: "300px", flexShrink: 0 }}>
              <div style={{ aspectRatio: "16/9", backgroundColor: "#000", overflow: "hidden", position: "relative" }}>
                {thumbnail && <img src={thumbnail.toString()} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />}
                {(video || videoFile) && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 0, height: 0, borderTop: "15px solid transparent", borderLeft: "25px solid white", borderBottom: "15px solid transparent", opacity: 0.9 }} />
                    {playButtonText && (
                      <span style={{ marginTop: "12px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff" }}>
                        {playButtonText}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
              <h2 style={{ fontSize: "18px", letterSpacing: "0.05em", marginBottom: "4px", fontVariantCaps: "small-caps" }}>{title}</h2>
              {artist && <h3 style={{ fontSize: "18px", letterSpacing: "0.05em", marginBottom: "16px", color: "#374151", fontVariantCaps: "small-caps" }}>{artist}</h3>}
              {creditsList.length > 0 && (
                <div style={{ fontSize: "14px", lineHeight: "1.625", fontVariantCaps: "small-caps" }}>
                  {creditsList.map((credit, index) => (
                    <p key={index} style={{ color: "#4b5563", marginBottom: "2px" }}>{credit}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })

      // -----------------------------------------------
      // HOMEPAGE PREVIEW
      // -----------------------------------------------
      CMS.registerPreviewTemplate("homepage", ({ entry, getAsset }) => {
        const mode = entry.getIn(["data", "backgroundMode"]) || "video"
        const videoFile = entry.getIn(["data", "videoFile"]) || ""
        const backgroundImage = getAsset(entry.getIn(["data", "backgroundImage"]))
        const carouselImages = entry.getIn(["data", "carouselImages"])
        const overlayOpacity = entry.getIn(["data", "overlayOpacity"]) ?? 50
        const layout = entry.getIn(["data", "contentLayout"]) || "centered"
        const line1 = entry.getIn(["data", "headingLine1"]) || ""
        const line2 = entry.getIn(["data", "headingLine2"]) || ""
        const subheading = entry.getIn(["data", "subheading"]) || ""
        const textColor = entry.getIn(["data", "textColor"]) || "#ffffff"
        const linksData = entry.getIn(["data", "links"])
        const links = linksData ? linksData.toJS() : []
        const bottomText = entry.getIn(["data", "bottomText"]) || ""
        const bottomLink = entry.getIn(["data", "bottomLink"]) || ""

        const images = carouselImages ? carouselImages.toJS() : []

        let bgElement = null
        if (mode === "video" && videoFile) {
          bgElement = (
            <div style={{ width: "100%", height: "100%", backgroundColor: "#333", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "14px" }}>
              Video: {videoFile}
            </div>
          )
        } else if (mode === "image" && backgroundImage) {
          bgElement = <img src={backgroundImage.toString()} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
        } else if (mode === "carousel" && images.length > 0) {
          const firstImage = getAsset(images[0])
          bgElement = <img src={firstImage?.toString() || images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
        }

        return (
          <div style={{ position: "relative", width: "100%", height: "500px", backgroundColor: "#000", overflow: "hidden" }}>
            {bgElement}
            <div style={{ position: "absolute", inset: 0, backgroundColor: "#000", opacity: overlayOpacity / 100 }} />

            {layout === "centered" && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                {(line1 || line2) && (
                  <h1 style={{ fontFamily: "serif", fontSize: "48px", marginBottom: "16px", letterSpacing: "-0.025em", lineHeight: 0.9, color: textColor }}>
                    {line1}
                    {line2 && <br />}
                    {line2}
                  </h1>
                )}
                {subheading && (
                  <p style={{ fontFamily: "sans-serif", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.3em", opacity: 0.8, color: textColor }}>
                    {subheading}
                  </p>
                )}
              </div>
            )}

            {layout === "left-links" && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 48px" }}>
                {(line1 || line2) && (
                  <h1 style={{ fontFamily: "serif", fontSize: "56px", letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: "8px", color: textColor }}>
                    {line1}
                    {line2 && <br />}
                    {line2}
                  </h1>
                )}
                {subheading && (
                  <p style={{ fontFamily: "serif", fontSize: "24px", letterSpacing: "-0.025em", marginBottom: "24px", color: textColor }}>
                    {subheading}
                  </p>
                )}
                {links.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
                    {links.map((link, i) => (
                      <span key={i} style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.2em", color: textColor }}>
                        {link.text}
                      </span>
                    ))}
                  </div>
                )}
                {bottomText && (
                  <div style={{ marginTop: "48px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.2em", color: textColor }}>
                      {bottomText}
                    </span>
                    {bottomLink && (
                      <span style={{ fontSize: "10px", opacity: 0.4, marginLeft: "8px", color: textColor }}>
                        links to {bottomLink}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {debugLabel(`Mode: ${mode} | Layout: ${layout} | Overlay: ${overlayOpacity}%${mode === "carousel" ? ` | ${images.length} images | Interval: ${entry.getIn(["data", "carouselInterval"]) || 4000}ms` : ""}`)}
          </div>
        )
      })

      // -----------------------------------------------
      // ABOUT PREVIEW
      // -----------------------------------------------
      CMS.registerPreviewTemplate("about", ({ entry, getAsset }) => {
        const bgColor = entry.getIn(["data", "bgColor"]) || "#ffffff"
        const textColor = entry.getIn(["data", "textColor"]) || "#000000"
        const heading = entry.getIn(["data", "heading"]) || ""
        const headingLine2 = entry.getIn(["data", "headingLine2"]) || ""
        const layout = entry.getIn(["data", "layout"]) || "photo-left"
        const photo = getAsset(entry.getIn(["data", "photo"]))
        const photoSize = entry.getIn(["data", "photoSize"]) || "35"

        const bioIntro = entry.getIn(["data", "bioIntro"]) || ""
        const bioIntroStyle = entry.getIn(["data", "bioIntroStyle"]) || "normal"
        const bioIntroSize = entry.getIn(["data", "bioIntroSize"]) || "md"
        const bioIntroColor = entry.getIn(["data", "bioIntroColor"]) || textColor
        const bioIntroFont = entry.getIn(["data", "bioIntroFont"]) || "body"

        const bio = entry.getIn(["data", "bio"]) || ""
        const bioStyle = entry.getIn(["data", "bioStyle"]) || "normal"
        const bioSize = entry.getIn(["data", "bioSize"]) || "sm"
        const bioColor = entry.getIn(["data", "bioColor"]) || textColor
        const bioFont = entry.getIn(["data", "bioFont"]) || "body"

        const contactSectionData = entry.getIn(["data", "contactSection"])
        const contactSection = contactSectionData ? contactSectionData.toJS() : {}
        const contactContent = contactSection.content || ""
        const contactStyle = contactSection.style || "normal"
        const contactSize = contactSection.size || "sm"
        const contactColor = contactSection.color || textColor
        const contactFont = contactSection.font || "body"

        const footerData = entry.getIn(["data", "footer"])
        const footer = footerData ? footerData.toJS() : {}
        const footerLinks = footer.links || []
        const footerSocial = footer.socialLinks || []

        const hasPhoto = photo && layout !== "text-only"
        const isSideBySide = layout === "photo-left" || layout === "photo-right"

        const sizeMap = { xs: "11px", sm: "12px", md: "14px", lg: "16px", xl: "20px" }
        const fontMap = { body: "sans-serif", heading: "serif", subtitle: "sans-serif" }

        const getTextStyles = (style, size, color, font) => ({
          fontSize: sizeMap[size] || "12px",
          color: color,
          fontFamily: fontMap[font] || "sans-serif",
          fontWeight: style === "bold" || style === "bold-italic" ? 700 : 400,
          fontStyle: style === "italic" || style === "bold-italic" ? "italic" : "normal",
          lineHeight: 1.6,
        })

        const renderMarkdown = (md, style, size, color, font) => {
          if (!md) return null
          let html = md
          html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
          html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
          html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
          html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
          html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
          html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
          html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="text-decoration:underline">$1</a>')
          html = html.replace(/\n{2,}/g, '</p><p>')
          html = html.replace(/\n/g, '<br />')
          html = `<p>${html}</p>`
          html = html.replace(/<p>\s*<\/p>/g, '')

          return (
            <div
              style={{ ...getTextStyles(style, size, color, font), marginBottom: "16px" }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )
        }

        const contentBlock = (
          <>
            {bioIntro && (
              <p style={{ ...getTextStyles(bioIntroStyle, bioIntroSize, bioIntroColor, bioIntroFont), marginBottom: "16px" }}>
                {bioIntro}
              </p>
            )}
            {renderMarkdown(bio, bioStyle, bioSize, bioColor, bioFont)}
            {renderMarkdown(contactContent, contactStyle, contactSize, contactColor, contactFont)}
          </>
        )

        return (
          <div style={{ backgroundColor: bgColor, color: textColor, minHeight: "600px" }}>
            <div style={{ padding: "64px 48px 32px" }}>
              <h1 style={{ fontSize: "48px", lineHeight: 0.9, letterSpacing: "-0.025em", marginBottom: "32px", color: textColor }}>
                {heading}
                {headingLine2 && <br />}
                {headingLine2}
              </h1>

              {layout === "photo-top" && hasPhoto && (
                <div style={{ marginBottom: "32px" }}>
                  <img src={photo.toString()} alt="" style={{ width: `${photoSize}%`, height: "auto" }} />
                </div>
              )}

              {isSideBySide ? (
                <div style={{ display: "flex", gap: "32px", flexDirection: layout === "photo-right" ? "row-reverse" : "row" }}>
                  {hasPhoto && (
                    <div style={{ width: `${photoSize}%`, flexShrink: 0 }}>
                      <img src={photo.toString()} alt="" style={{ width: "100%", height: "auto" }} />
                    </div>
                  )}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {contentBlock}
                  </div>
                </div>
              ) : (
                <div style={{ maxWidth: "600px" }}>
                  {contentBlock}
                </div>
              )}
            </div>

            {(footerLinks.length > 0 || footerSocial.length > 0) && (
              <div style={{ padding: "48px", textAlign: "center", backgroundColor: footer.bgColor || bgColor }}>
                {footerLinks.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginBottom: footerSocial.length > 0 ? "24px" : 0 }}>
                    {footerLinks.map((link, i) => (
                      <span key={i} style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.3em", color: link.color || "#000" }}>
                        {link.text}
                      </span>
                    ))}
                  </div>
                )}
                {footerSocial.length > 0 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                    {footerSocial.map((social, i) => (
                      <div key={i} style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: social.color || "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: "9px", fontWeight: "bold" }}>
                          {(social.platform || "?").charAt(0).toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {debugLabel(`Layout: ${layout} | Photo: ${photoSize}%`)}
          </div>
        )
      })

      // -----------------------------------------------
      // GENERAL SETTINGS PREVIEW
      // -----------------------------------------------
      CMS.registerPreviewTemplate("general", ({ entry }) => {
        const brandName = entry.getIn(["data", "brandName"]) || ""
        const email = entry.getIn(["data", "email"]) || ""
        const headerLayout = entry.getIn(["data", "headerLayout"]) || "brand-left-nav-right"
        const navStyle = entry.getIn(["data", "navStyle"]) || "solid"
        const headingFont = entry.getIn(["data", "headingFont"]) || "Bungee"
        const bodyFont = entry.getIn(["data", "bodyFont"]) || "Inter"
        const subtitleFont = entry.getIn(["data", "subtitleFont"]) || ""
        const navLinks = entry.getIn(["data", "navLinks"])
        const links = navLinks ? navLinks.toJS() : []

        const layoutLabels = {
          "brand-left-nav-right": "Brand Left, Nav Right",
          "brand-right-nav-left": "Brand Right, Nav Left",
          "brand-only-left": "Brand Only (Left)",
          "brand-only-right": "Brand Only (Right)",
          "nav-only-left": "Nav Only (Left)",
          "nav-only-right": "Nav Only (Right)",
          "none": "None",
        }

        const settingCard = (label, value) => (
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666", marginBottom: "8px" }}>{label}</h2>
            <p style={{ fontSize: "16px", color: "#000" }}>{value}</p>
          </div>
        )

        return (
          <div style={{ fontFamily: "sans-serif", padding: "32px", backgroundColor: "#f9f9f9", minHeight: "400px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <h2 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666", marginBottom: "8px" }}>Brand Name</h2>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "#000" }}>{brandName}</p>
            </div>

            {settingCard("Email", email)}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {settingCard("Header Layout", layoutLabels[headerLayout] || headerLayout)}
              {settingCard("Nav Style", navStyle)}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              {settingCard("Heading Font", headingFont)}
              {settingCard("Body Font", bodyFont)}
              {settingCard("Subtitle Font", subtitleFont || `(${bodyFont})`)}
            </div>

            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <h2 style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666", marginBottom: "16px" }}>Navigation Links</h2>
              {links.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {links.map((link, index) => (
                    <li key={index} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: index < links.length - 1 ? "1px solid #eee" : "none" }}>
                      <span style={{ fontWeight: "500", color: "#000" }}>{link.label}</span>
                      <span style={{ color: "#666", fontFamily: "monospace" }}>{link.url}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#999" }}>No navigation links configured</p>
              )}
            </div>
          </div>
        )
      })
    }
    document.body.appendChild(script)
  }, [])

  return <div id="nc-root" />
}

export default AdminPage

export const Head = () => (
  <>
    <title>Content Manager</title>
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js" />
  </>
)
