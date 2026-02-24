const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    query {
      allFilmsJson {
        nodes {
          slug
          title
          thumbnail
          order
          blocks {
            type
            image
            maxHeight
            video
            videoFile
            thumbnail
            playButtonText
            images {
              image
              alt
              overlayStyle
              overlayFont
              overlayTitle
              overlaySubtitle
              overlayLeft
              overlayRight
              overlayColor
              overlayLink
            }
            interval
            title
            projectType
            year
            director
            description
            heading
            body
            alt
            caption
            overlayStyle
            overlayTitle
            overlaySubtitle
            overlayLeft
            overlayRight
            overlayColor
            overlayLink
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
    }
  `)

  result.data.allFilmsJson.nodes.forEach((film) => {
    createPage({
      path: `/${film.slug}`,
      component: path.resolve("./src/templates/film.js"),
      context: {
        ...film,
      },
    })
  })
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "react/umd/react.production.min.js": require.resolve("react"),
        "react-dom/umd/react-dom.production.min.js": require.resolve("react-dom"),
      },
    },
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type HomepageJson implements Node {
      backgroundMode: String
      backgroundImage: String
      videoFile: String
      carouselImages: [String]
      carouselInterval: Int
      overlayOpacity: Int
      contentLayout: String
      headingLine1: String
      headingLine2: String
      subheading: String
      textColor: String
      links: [HomepageLink]
      bottomText: String
      bottomLink: String
    }

    type HomepageLink {
      text: String
      url: String
    }

    type SettingsJson implements Node {
      brandName: String
      email: String
      headerLayout: String
      navStyle: String
      headingFont: String
      bodyFont: String
      subtitleFont: String
      navLinks: [NavLink]
    }

    type NavLink {
      label: String
      url: String
    }

    type AboutJson implements Node {
      bgColor: String
      textColor: String
      heading: String
      headingLine2: String
      layout: String
      photo: String
      photoSize: String
      bioIntro: String
      bioIntroStyle: String
      bioIntroSize: String
      bioIntroColor: String
      bioIntroFont: String
      bio: String
      bioStyle: String
      bioSize: String
      bioColor: String
      bioFont: String
      contactSection: ContactSection
      footer: AboutFooter
    }

    type ContactSection {
      content: String
      style: String
      size: String
      color: String
      font: String
    }

    type AboutFooter {
      bgColor: String
      links: [FooterLink]
      socialLinks: [SocialLink]
    }

    type FilmsJson implements Node {
      slug: String
      title: String
      thumbnail: String
      order: Int
      blocks: [FilmBlock]
    }

    type FilmBlock {
      type: String
      image: String
      maxHeight: String
      video: String
      videoFile: String
      thumbnail: String
      playButtonText: String
      images: [GalleryImage]
      interval: Int
      title: String
      projectType: String
      year: String
      director: String
      description: String
      heading: String
      body: String
      alt: String
      caption: String
      overlayStyle: String
      overlayFont: String
      overlayTitle: String
      overlaySubtitle: String
      overlayLeft: String
      overlayRight: String
      overlayColor: String
      overlayLink: String
      bgColor: String
      links: [FooterLink]
      socialLinks: [SocialLink]
    }

    type GalleryImage {
      image: String
      alt: String
      overlayStyle: String
      overlayFont: String
      overlayTitle: String
      overlaySubtitle: String
      overlayLeft: String
      overlayRight: String
      overlayColor: String
      overlayLink: String
    }

    type FooterLink {
      text: String
      url: String
      color: String
    }

    type SocialLink {
      platform: String
      url: String
      color: String
    }

    type MusicVideoJson implements Node {
      title: String
      artist: String
      thumbnail: String
      video: String
      videoFile: String
      playButtonText: String
      order: Int
      credits: [String]
    }
  `)
}
