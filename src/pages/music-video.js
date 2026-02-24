import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout"
import MediaPlayer from "../components/MediaPlayer"
import Seo from "../components/Seo"

export default function MusicVideoPage({ data }) {
  const projects = data.allMusicVideoJson.nodes.sort((a, b) => a.order - b.order)

  return (
    <Layout>
      <div className="bg-white min-h-screen w-full">
        <div className="px-6 md:px-12 pt-32 md:pt-40 pb-16">
          <h1
            className="text-black text-4xl md:text-5xl lg:text-6xl leading-tight"
            style={{ fontFamily: "var(--heading-font), cursive" }}
          >
            Music Video
          </h1>
        </div>

        <div className="flex flex-col gap-20 md:gap-28 pb-24">
          {projects.map((project, index) => {
            const videoSource = project.video || project.videoFile

            return (
              <div
                key={index}
                className="flex flex-col lg:flex-row px-6 md:px-12"
              >
                <div className="w-full lg:w-[45%] flex-shrink-0">
                  <MediaPlayer
                    video={videoSource}
                    thumbnail={project.thumbnail}
                    title={project.title}
                    playButtonText={project.playButtonText}
                    className="w-full"
                  />
                </div>

                <div
                  className="lg:pl-12 xl:pl-16 mt-6 lg:mt-0 flex flex-col justify-start max-w-md"
                  style={{ fontFamily: "var(--body-font), sans-serif" }}
                >
                  <h2
                    className="text-black text-xl md:text-2xl tracking-wide mb-1"
                    style={{ fontVariantCaps: "small-caps", fontFamily: "var(--heading-font), cursive" }}
                  >
                    {project.title}
                  </h2>

                  {project.artist && (
                    <h3
                      className="text-black text-xl md:text-2xl tracking-wide mb-4"
                      style={{ fontVariantCaps: "small-caps", fontFamily: "var(--subtitle-font, var(--body-font)), sans-serif" }}
                    >
                      {project.artist}
                    </h3>
                  )}

                  {project.credits && project.credits.length > 0 && (
                    <div
                      className="text-black text-md md:text-lg leading-relaxed space-y-0.5"
                    >
                      {project.credits.map((credit, i) => (
                        <p
                          key={i}
                          style={{ fontFamily: "sans-serif" }}
                        >
                          {credit}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMusicVideoJson {
      nodes {
        title
        artist
        thumbnail
        video
        videoFile
        playButtonText
        credits
        order
      }
    }
  }
`

export const Head = () => <Seo title="Music Video" />
