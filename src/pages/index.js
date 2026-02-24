import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import HeroMedia from "../components/HeroMedia"
import Seo from "../components/Seo"

export default function IndexPage({ data }) {
  const homepage = data.homepageJson || {}
  const mode = homepage.backgroundMode || "video"
  const videoSrc = homepage.videoFile || "/videos/uploads/skate.mp4"
  const images = homepage.carouselImages || []
  const singleImage = homepage.backgroundImage || null
  const interval = homepage.carouselInterval || 4000
  const overlayOpacity = homepage.overlayOpacity ?? 50
  const layout = homepage.contentLayout || "centered"
  const line1 = homepage.headingLine1 || ""
  const line2 = homepage.headingLine2 || ""
  const subheading = homepage.subheading || ""
  const textColor = homepage.textColor || "#ffffff"
  const links = homepage.links || []
  const bottomText = homepage.bottomText || ""
  const bottomLink = homepage.bottomLink || ""

  const hasHeading = line1 || line2

  return (
    <Layout>
      <HeroMedia
        mode={mode}
        image={singleImage}
        images={images}
        carouselInterval={interval}
        videoSource={videoSrc}
        overlay={true}
        overlayOpacity={overlayOpacity}
        fixed={true}
        className="z-0"
      />

      {layout === "centered" && (hasHeading || subheading) && (
        <div className="relative z-10 h-screen flex flex-col justify-center items-center text-center pointer-events-none">
          <div className="pointer-events-auto">
            {hasHeading && (
              <h1
                className="text-5xl md:text-7xl mb-4 tracking-tighter leading-[0.9]"
                style={{ color: textColor, fontFamily: "var(--heading-font), cursive" }}
              >
                {line1}
                {line2 && (
                  <>
                    <br />
                    {line2}
                  </>
                )}
              </h1>
            )}
            {subheading && (
              <p
                className="font-bold text-xs uppercase tracking-[0.3em] opacity-80"
                style={{ color: textColor, fontFamily: "var(--subtitle-font), sans-serif" }}
              >
                {subheading}
              </p>
            )}
          </div>
        </div>
      )}

      {layout === "left-links" && (
        <div className="relative z-10 h-screen flex flex-col justify-center pointer-events-none px-6 md:px-12">
          <div className="pointer-events-auto">
            {hasHeading && (
              <h1
                className="text-5xl md:text-7xl mb-2 tracking-tighter leading-[1.15]"
                style={{ color: textColor, fontFamily: "var(--heading-font), cursive" }}
              >
                {line1}
                {line2 && (
                  <>
                    <br />
                    {line2}
                  </>
                )}
              </h1>
            )}

            {subheading && (
              <p
                className="font-bold text-2xl md:text-3xl tracking-tighter mb-6"
                style={{ color: textColor, fontFamily: "var(--subtitle-font), cursive" }}
              >
                {subheading}
              </p>
            )}

            {links.length > 0 && (
              <div className="flex flex-col gap-1 mt-2">
                {links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    className="text-xs uppercase tracking-[0.2em] hover:opacity-50 transition-opacity"
                    style={{ color: textColor, fontFamily: "var(--subtitle-font), sans-serif" }}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            )}

            {bottomText && (
              <div className="mt-16">
                {bottomLink ? (
                  <a
                    href={bottomLink}
                    className="text-base font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-opacity"
                    style={{ color: textColor }}
                  >
                    {bottomText}
                  </a>
                ) : (
                  <span
                    className="text-base font-bold uppercase tracking-[0.2em]"
                    style={{ color: textColor }}
                  >
                    {bottomText}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}

export const query = graphql`
  query HomepageQuery {
    homepageJson {
      backgroundMode
      backgroundImage
      videoFile
      carouselImages
      carouselInterval
      overlayOpacity
      contentLayout
      headingLine1
      headingLine2
      subheading
      textColor
      links {
        text
        url
      }
      bottomText
      bottomLink
    }
  }
`

export const Head = () => <Seo />
