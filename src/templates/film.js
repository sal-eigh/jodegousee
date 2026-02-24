import React from "react"
import Layout from "../components/Layout"
import ContentBlocks from "../components/ContentBlocks"
import Seo from "../components/Seo"

export default function FilmTemplate({ pageContext }) {
  const { blocks } = pageContext

  return (
    <Layout>
      <ContentBlocks blocks={blocks || []} />
    </Layout>
  )
}

export const Head = ({ pageContext }) => <Seo title={pageContext.title} />
