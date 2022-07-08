import React from 'react'
import { Instagram, Linkedin, Mail } from 'react-feather'
import { graphql } from 'gatsby'

import PageHeader from '../components/PageHeader'
import Content from '../components/Content'
import Layout from '../components/Layout'
import Image from '../components/Image'
import './ContactPage.css'

// Export Template for use in CMS preview

export const ContactPageTemplate = ({
  profilePic,
  title,
  subtitle,
  featuredImage,
  instagram,
  linkedin,
  instagramLink,
  linkedinLink,
  profilePic
}) => (
  <main className="Contact">
    <PageHeader
      title={title}
      subtitle={subtitle}
      backgroundImage={featuredImage}
    />
    <section className="section Contact--Section1">
      <div className="container Contact--Section1--Container">
        <div className="Contact--Details">
          {instagram && (
            <a className="Contact--Details--Item" href={instagramLink} target="_blank" rel="noopener noreferrer">
              <Instagram /> {instagram}
            </a>
          )}
          {linkedin && (
            <a className="Contact--Details--Item" href={linkedinLink} target="_blank" rel="noopener noreferrer">
              <Linkedin /> {linkedin}
            </a>
          )}
        </div>
      </div>
    </section>
  </main>
)

const ContactPage = ({ data: { page } }) => (
  <Layout
    meta={page.frontmatter.meta || false}
    title={page.frontmatter.title || false}
  >
    <ContactPageTemplate {...page.frontmatter} />
  </Layout>
)

export default ContactPage

export const pageQuery = graphql`
  query ContactPage($id: String) {
    page: markdownRemark(id: { eq: $id }) {
      ...Meta
      html
      frontmatter {
        title
        template
        subtitle
        featuredImage
        instagram
        linkedin
        instagramLink
        linkedinLink
        profilePic
      }
    }
  }
`
