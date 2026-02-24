import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export default function Seo({ title, description, children }) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

  const defaultTitle = site.siteMetadata?.title
  const metaDescription = description || site.siteMetadata?.description
  const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {children}
    </>
  )
}
