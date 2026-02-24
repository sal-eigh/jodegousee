import React from "react"
import { graphql } from "gatsby"
import ReactMarkdown from "react-markdown"
import Layout from "../components/Layout"
import SocialIcons from "../components/SocialIcons"
import Seo from "../components/Seo"

const SIZE_CLASSES = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
}

const SIZE_CLASSES_RESPONSIVE = {
  xs: "text-xs md:text-sm",
  sm: "text-sm md:text-base",
  md: "text-base md:text-lg",
  lg: "text-lg md:text-xl",
  xl: "text-xl md:text-2xl",
}

const FONT_VARS = {
  body: "var(--body-font), sans-serif",
  heading: "var(--heading-font), cursive",
  subtitle: "var(--subtitle-font), sans-serif",
}

function getTextStyle(style) {
  const isBold = style === "bold" || style === "bold-italic"
  const isItalic = style === "italic" || style === "bold-italic"
  return {
    fontWeight: isBold ? 700 : 400,
    fontStyle: isItalic ? "italic" : "normal",
  }
}

function StyledText({ text, size, color, font, fontStyle, responsive = false, className = "" }) {
  if (!text) return null

  const sizeClass = responsive ? SIZE_CLASSES_RESPONSIVE[size] : SIZE_CLASSES[size]
  const textStyles = getTextStyle(fontStyle)

  return (
    <p
      className={`${sizeClass} leading-relaxed ${className}`}
      style={{
        color,
        fontFamily: FONT_VARS[font],
        ...textStyles,
      }}
    >
      {text}
    </p>
  )
}

function StyledMarkdown({ markdown, size, color, font, fontStyle, className = "" }) {
  if (!markdown) return null

  const baseStyles = getTextStyle(fontStyle)
  const fontFamily = FONT_VARS[font]

  const components = {
    p: ({ children }) => (
      <p style={{ marginBottom: "1em", color, fontFamily, ...baseStyles }}>
        {children}
      </p>
    ),
    strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    h1: ({ children }) => (
      <h1 style={{ fontSize: "1.75em", fontWeight: 700, marginBottom: "0.5em", color, fontFamily }}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontSize: "1.5em", fontWeight: 700, marginBottom: "0.5em", color, fontFamily }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ fontSize: "1.25em", fontWeight: 700, marginBottom: "0.5em", color, fontFamily }}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 style={{ fontSize: "1.1em", fontWeight: 700, marginBottom: "0.5em", color, fontFamily }}>
        {children}
      </h4>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        style={{ textDecoration: "underline", color }}
        target={href?.startsWith("http") ? "_blank" : "_self"}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul style={{ paddingLeft: "1.5em", marginBottom: "1em", listStyleType: "disc" }}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol style={{ paddingLeft: "1.5em", marginBottom: "1em", listStyleType: "decimal" }}>
        {children}
      </ol>
    ),
    li: ({ children }) => <li style={{ marginBottom: "0.25em" }}>{children}</li>,
    blockquote: ({ children }) => (
      <blockquote style={{ borderLeft: `3px solid ${color}`, paddingLeft: "1em", opacity: 0.8, marginBottom: "1em" }}>
        {children}
      </blockquote>
    ),
  }

  return (
    <div className={`${SIZE_CLASSES[size]} leading-relaxed ${className}`}>
      <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
    </div>
  )
}

function AboutFooter({ links, socialLinks, bgColor }) {
  if (links.length === 0 && socialLinks.length === 0) return null

  return (
    <div className="w-full py-16 md:py-24 px-6" style={{ backgroundColor: bgColor }}>
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        {links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                className="uppercase text-xs tracking-[0.3em] hover:opacity-50 transition-opacity"
                style={{ color: link.color || "#000000", fontFamily: "var(--body-font), sans-serif" }}
                target={link.url?.startsWith("http") ? "_blank" : "_self"}
                rel={link.url?.startsWith("http") ? "noopener noreferrer" : undefined}
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

export default function AboutPage({ data }) {
  const about = data.aboutJson || {}

  const bgColor = about.bgColor || "#ffffff"
  const textColor = about.textColor || "#000000"
  const heading = about.heading || ""
  const headingLine2 = about.headingLine2 || ""
  const layout = about.layout || "photo-left"
  const photo = about.photo || null
  const photoSize = about.photoSize || "35"

  const bioIntro = {
    text: about.bioIntro || "",
    style: about.bioIntroStyle || "normal",
    size: about.bioIntroSize || "md",
    color: about.bioIntroColor || textColor,
    font: about.bioIntroFont || "body",
  }

  const bio = {
    content: about.bio || "",
    style: about.bioStyle || "normal",
    size: about.bioSize || "sm",
    color: about.bioColor || textColor,
    font: about.bioFont || "body",
  }

  const contact = about.contactSection || {}
  const contactSection = {
    content: contact.content || "",
    style: contact.style || "normal",
    size: contact.size || "sm",
    color: contact.color || textColor,
    font: contact.font || "body",
  }

  const footer = about.footer || {}
  const footerLinks = footer.links || []
  const footerSocial = footer.socialLinks || []
  const footerBg = footer.bgColor || bgColor

  const hasPhoto = photo && layout !== "text-only"
  const isSideBySide = layout === "photo-left" || layout === "photo-right"

  const contentBlock = (
    <>
      <StyledText
        text={bioIntro.text}
        size={bioIntro.size}
        color={bioIntro.color}
        font={bioIntro.font}
        fontStyle={bioIntro.style}
        responsive
        className="mb-6"
      />
      <StyledMarkdown
        markdown={bio.content}
        size={bio.size}
        color={bio.color}
        font={bio.font}
        fontStyle={bio.style}
        className="mb-8"
      />
      <StyledMarkdown
        markdown={contactSection.content}
        size={contactSection.size}
        color={contactSection.color}
        font={contactSection.font}
        fontStyle={contactSection.style}
        className="mt-auto"
      />
    </>
  )

  return (
    <Layout>
      <div className="min-h-screen" style={{ backgroundColor: bgColor, color: textColor }}>
        <div className="px-6 md:px-12 lg:px-16 pt-32 md:pt-40 pb-16 max-w-7xl mx-auto">

          <h1
            className="text-4xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tighter mb-10"
            style={{ fontFamily: "var(--heading-font), cursive", color: textColor }}
          >
            {heading}
            {headingLine2 && (
              <>
                <br />
                {headingLine2}
              </>
            )}
          </h1>

          {layout === "photo-top" && hasPhoto && (
            <div className="mb-10">
              <img src={photo} alt="" className="h-auto max-w-lg" style={{ width: `${photoSize}%` }} />
            </div>
          )}

          {isSideBySide ? (
            <div className={`flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16 ${layout === "photo-right" ? "lg:flex-row-reverse" : ""}`}>
              {hasPhoto && (
                <div className="w-full lg:w-2/5 xl:w-1/3 flex-shrink-0">
                  <img src={photo} alt="" className="w-full h-auto max-w-md lg:max-w-none" />
                </div>
              )}
              <div className="flex-1 flex flex-col max-w-2xl">
                {contentBlock}
              </div>
            </div>
          ) : (
            <div className="mb-16 max-w-2xl">
              {contentBlock}
            </div>
          )}
        </div>

        <AboutFooter links={footerLinks} socialLinks={footerSocial} bgColor={footerBg} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query AboutQuery {
    aboutJson {
      bgColor
      textColor
      heading
      headingLine2
      layout
      photo
      photoSize
      bioIntro
      bioIntroStyle
      bioIntroSize
      bioIntroColor
      bioIntroFont
      bio
      bioStyle
      bioSize
      bioColor
      bioFont
      contactSection {
        content
        style
        size
        color
        font
      }
      footer {
        bgColor
        links {
          text
          url
          color
        }
        socialLinks {
          platform
          url
          color
        }
      }
    }
  }
`

export const Head = () => <Seo title="About" />
