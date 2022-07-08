import React from 'react'
import { Instagram, Linkedin, Mail } from 'react-feather'
import { graphql } from 'gatsby'

import PageHeader from '../components/PageHeader'
import Content from '../components/Content'
import Layout from '../components/Layout'
import './ContactPage.css'

// Export Template for use in CMS preview

export const ContactPageTemplate = ({
  title,
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
      backgroundImage={featuredImage}
    />
    <section className="section Contact--Section1">
      <div className="container Contact--Section1--Container">
        <div className="Contact--Details">
          <img
            className="Content--Image Contact--Details__Pic"
            src={profilePic}
          />
          <div className="Contact--Details--Items">
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
