const path = require('path')

module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "Improbable-AI.github.io",
  },
  plugins: [
    "gatsby-plugin-slug",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "282949039",
      },
    },
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-mdx-frontmatter",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    {
      resolve: `gatsby-remark-videos`,
      options: {
        pipelines: [
          {
            name: 'vp9',
            transcode: chain =>
                chain
                    .videoCodec('libvpx-vp9')
                    .noAudio()
                    .outputOptions(['-crf 20', '-b:v 0']),
            maxHeight: 480,
            maxWidth: 900,
            fileExtension: 'webm',
          },
          {
            name: 'h264',
            transcode: chain =>
                chain
                    .videoCodec('libx264')
                    .noAudio()
                    .addOption('-profile:v', 'main')
                    .addOption('-pix_fmt', 'yuv420p')
                    .outputOptions(['-movflags faststart'])
                    .videoBitrate('1000k'),
            maxHeight: 480,
            maxWidth: 900,
            fileExtension: 'mp4',
          },
        ],
      }
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          default: path.resolve('./src/components/mdx-layout.js')
        },
        remarkPlugins: [require(`remark-math`)],
        rehypePlugins: [require('rehype-katex')],
        gatsbyRemarkPlugins: [
          // {
          //   resolve: `gatsby-remark-images`,
          //   options: {maxWidth: 1200,},
          // },
          {
            resolve: `gatsby-remark-copy-images`,
            options: {
              destinationDir: f => `${f.hash}/${f.name}`,
              ignoreFileExtensions: [],
              // ignoreFileExtensions: [`png`, `jpg`, `jpeg`, `tiff`],
            }
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir: f => `${f.hash}/${f.name}`,
              ignoreFileExtensions: [],
              // ignoreFileExtensions: [`png`, `jpg`, `jpeg`, `tiff`],
            }
          },
        ],
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: `${__dirname}/src/pages/`,
      },
      __key: "pages",
    },
  ],
};
