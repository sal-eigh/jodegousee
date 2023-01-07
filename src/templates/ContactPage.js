import React from 'react'
import { Instagram, Linkedin } from 'react-feather'
import { graphql } from 'gatsby'

import PageHeader from '../components/PageHeader'
import Layout from '../components/Layout'
import SVGIcon from '../components/SVGIcon'
import './ContactPage.css'

// Export Template for use in CMS preview

export const ContactPageTemplate = ({
  title,
  featuredImage,
  vimeo,
  instagram,
  linkedin,
  vimeoLink,
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
            {vimeo && (
              <a className="Contact--Details--Item" href={vimeoLink} target="_blank" rel="noopener noreferrer">
                 <SVGIcon src="/images/vimeo.svg" /> {vimeo}
              </a>
            )}
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
        vimeo
        instagram
        linkedin
        vimeoLink
        instagramLink
        linkedinLink
        profilePic
      }
    }
  }
`
