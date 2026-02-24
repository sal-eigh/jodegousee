import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Link, useStaticQuery, graphql } from "gatsby"

function buildGoogleFontsUrl(fonts) {
  const uniqueFonts = [...new Set(fonts.filter(Boolean))]
  if (uniqueFonts.length === 0) return null
  const families = uniqueFonts
    .map((f) => f.replace(/ /g, "+") + ":wght@400;700")
    .join("&family=")
  return `https://fonts.googleapis.com/css2?family=${families}&display=swap`
}

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [brandVisible, setBrandVisible] = useState(true)
  const menuRef = useRef(null)

  const data = useStaticQuery(graphql`
    query {
      settingsJson(brandName: { ne: null }) {
        brandName
        email
        headerLayout
        navStyle
        headingFont
        bodyFont
        subtitleFont
        navLinks {
          label
          url
        }
      }
    }
  `)

  const settings = data?.settingsJson || {
    brandName: "Jonathan Degousée",
    email: "jodegousee@gmail.com",
    headerLayout: "brand-left-nav-right",
    navStyle: "solid",
    headingFont: "Bungee",
    bodyFont: "Inter",
    subtitleFont: "",
    navLinks: []
  }

  const { brandName, headerLayout, navStyle, headingFont, bodyFont, subtitleFont, navLinks } = settings

  const resolvedHeadingFont = headingFont || "Bungee"
  const resolvedBodyFont = bodyFont || "Inter"
  const resolvedSubtitleFont = subtitleFont || resolvedBodyFont

  // Load Google Fonts dynamically
  useEffect(() => {
    const url = buildGoogleFontsUrl([resolvedHeadingFont, resolvedBodyFont, resolvedSubtitleFont])
    if (!url) return

    const existing = document.querySelector(`link[href="${url}"]`)
    if (existing) return

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = url
    document.head.appendChild(link)
  }, [resolvedHeadingFont, resolvedBodyFont, resolvedSubtitleFont])

  const showBrand = headerLayout.includes("brand")
  const showNav = headerLayout.includes("nav")
  const brandPosition = headerLayout.includes("brand-right") || headerLayout === "brand-only-right" ? "right" : "left"
  const navPosition = headerLayout.includes("nav-left") || headerLayout === "nav-only-left" ? "left" : "right"

  const resolvedBrandPosition = brandPosition
  const resolvedNavPosition = navPosition
  const isAdaptive = navStyle === "adaptive"

  useEffect(() => {
    const handleScroll = () => {
      setBrandVisible(window.scrollY < 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const Brand = () => (
    <div
      className={`text-sm tracking-widest uppercase font-bold transition-all duration-300 ${
        brandVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <Link to="/">{brandName}</Link>
    </div>
  )

  const Nav = () => (
    <div ref={menuRef} className="relative">
      <button
        className={`flex flex-col gap-2 cursor-pointer group ${
          resolvedNavPosition === "left" ? "items-start" : "items-end"
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-expanded={menuOpen}
        aria-haspopup="true"
        aria-label="Toggle menu"
      >
        <div className="relative w-10 h-3">
          <span
            className={`absolute h-[1px] bg-current transition-all duration-300 ease-in-out ${
              menuOpen
                ? resolvedNavPosition === "left"
                  ? "w-5 top-1/2 left-0 -translate-y-1/2 rotate-45 origin-center"
                  : "w-5 top-1/2 right-0 -translate-y-1/2 rotate-45 origin-center"
                : resolvedNavPosition === "left"
                  ? "w-6 top-0 right-0 -translate-x-[16px] group-hover:w-10 group-hover:translate-x-0"
                  : "w-6 top-0 left-0 translate-x-[16px] group-hover:w-10 group-hover:translate-x-0"
            }`}
          />
          <span
            className={`absolute h-[1px] bg-current transition-all duration-300 ease-in-out ${
              menuOpen
                ? resolvedNavPosition === "left"
                  ? "w-5 top-1/2 left-0 -translate-y-1/2 -rotate-45 origin-center"
                  : "w-5 top-1/2 right-0 -translate-y-1/2 -rotate-45 origin-center"
                : resolvedNavPosition === "left"
                  ? "w-4 bottom-0 right-0 -translate-x-[24px] group-hover:w-10 group-hover:translate-x-0"
                  : "w-4 bottom-0 left-0 translate-x-[24px] group-hover:w-10 group-hover:translate-x-0"
            }`}
          />
        </div>
        <span className="text-xs uppercase tracking-[0.2em]">Menu</span>
      </button>

      <div
        className={`absolute top-full mt-2 flex flex-col text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
          isAdaptive
            ? ""
            : "py-3 px-4 bg-black/80 backdrop-blur-sm rounded"
        } ${
          resolvedNavPosition === "right" ? "right-0 text-right" : "left-0 text-left"
        } ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {navLinks.map((link, i) => {
          const isExternal =
            link.url.startsWith("mailto:") || link.url.startsWith("http")

          const linkClass = isAdaptive
            ? "py-1.5 hover:opacity-50 transition-opacity whitespace-nowrap"
            : "py-1.5 text-white hover:text-white/70 transition-colors whitespace-nowrap"

          const activeClass = isAdaptive ? "opacity-50" : "text-white/50"

          return isExternal ? (
            <a
              key={i}
              href={link.url}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={i}
              to={link.url}
              activeClassName={activeClass}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        "--heading-font": `"${resolvedHeadingFont}"`,
        "--body-font": `"${resolvedBodyFont}"`,
        "--subtitle-font": `"${resolvedSubtitleFont}"`,
      }}
    >
      <nav
        className={`fixed top-0 left-0 w-full z-[100] ${
          isAdaptive ? "mix-blend-difference" : ""
        }`}
        role="navigation"
        aria-label="Main menu"
      >
        {!isAdaptive && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent pointer-events-none" />
        )}

        <div className="relative px-6 md:px-12 py-6 md:py-8 flex justify-between items-start text-white">
          <div className="flex items-start">
            {showBrand && resolvedBrandPosition === "left" && <Brand />}
            {showNav && resolvedNavPosition === "left" && <Nav />}
          </div>
          <div className="flex items-start">
            {showBrand && resolvedBrandPosition === "right" && <Brand />}
            {showNav && resolvedNavPosition === "right" && <Nav />}
          </div>
        </div>
      </nav>

      <main className="w-full h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

export default Layout
