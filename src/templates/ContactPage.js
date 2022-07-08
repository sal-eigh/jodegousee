import React from 'react'
import { Instagram, Linkedin, Mail } from 'react-feather'
import { graphql } from 'gatsby'

import PageHeader from '../components/PageHeader'
import Content from '../components/Content'
import Layout from '../components/Layout'
import './ContactPage.css'

// Export Template for use in CMS preview
export const ContactPageTemplate = ({
  body,
  title,
  subtitle,
  featuredImage,
  instagram,
  linkedin,
  email,
}) => (
  <main className="Contact">
    <PageHeader
      title={title}
      subtitle={subtitle}
      backgroundImage={featuredImage}
    />
    <section className="section Contact--Section1">
      <div className="container Contact--Section1--Container">
        <div>
          <Content source={body} />
          <div className="Contact--Details">
            {instagram && (
              <a className="Contact--Details--Item" href=`https://www.instagram.com/{instagram}/` target="_blank" rel="noopener noreferrer">
                <Instagram /> {instagram}
              </a>
            )}
            {linkedin && (
              <a className="Contact--Details--Item" href=`https://www.linkedin.com/in/{linkedin}/` target="_blank" rel="noopener noreferrer">
                <Linkedin /> {linkedin}
              </a>
            )}
            {email && (
              <a className="Contact--Details--Item">
                <Mail /> {email}
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
    <ContactPageTemplate {...page.frontmatter} body={page.html} />
  </Layout>
)

export default ContactPage

export const pageQuery = graphql`
  query ContactPage($id: String!) {
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
        email
      }
    }
  }
`
