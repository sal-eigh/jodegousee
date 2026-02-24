module.exports = {
  siteMetadata: {
    title: `Jonathan Degousée`,
    description: "Jonathan Degousée | Filmmaker & Writer | Toronto - Montreal"
  },
  plugins: [
    `gatsby-plugin-postcss`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `uploads`,
        path: `${__dirname}/static/images/uploads`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Jonathan Degousée`,
        short_name: `Jonathan Degousée`,
        start_url: `/`,
        background_color: `#ffffff`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`,
      },
    },
  ],
}