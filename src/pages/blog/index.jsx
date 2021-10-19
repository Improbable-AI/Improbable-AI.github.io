import React from "react"
import {graphql} from "gatsby"
// import PostCard from "../../components/postCard.js"
import styled from "styled-components"

import {Link} from "gatsby"

const PostCard = ({post}) => (
    <Link className="post" to={post.fields.slug}>
      <p className="title">{post.frontmatter.title}</p>
      <p className="details">{post.frontmatter.date}</p>
    </Link>
)

const StyledBlog = styled.div`
width: 900px;
max-width: 95%;
margin: 0 auto;
padding: 0 2.5%;

.hero {
  // background: blue;
  padding: 3em 0;
  width: 100%;
  border-bottom: solid gray 1px;
  margin-bottom: 3em;
  .hero-text {
    margin: 0 auto;
    padding: 0
    width: 95%;
    max-width: 900px;
  }
}

a.post {
  display: block;
  color: black;
  margin: 20px 0;
  text-decoration: none !important;
  &:hover {
    p.title {
      text-decoration: underline;
    }
  }
  p.details {
    margin: 0;
    color: gray;
  }
}
`;

export default function BlogIndex({
                                    data: {
                                      allMdx: {edges},
                                    },
                                  }) {
  const Posts = edges
      .filter(edge => !!edge.node.frontmatter.date) // You can filter your posts based on some criteria
      .map(edge => <PostCard key={edge.node.id} post={edge.node}/>)

  return <StyledBlog>
    <div className="hero">
      <div className="hero-text">
        <h1>The Improbable Blog</h1>
      </div>
    </div>
    <h2>All Posts</h2>
    {Posts}
  </StyledBlog>
}

export const pageQuery = graphql`
    query {
        allMdx(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
            edges {
                node {
                    id
                    fields {slug}
                    excerpt(pruneLength: 250)
                    frontmatter {
                        date(formatString: "MMMM DD, YYYY")
                        title
                    }
                }
            }
        }
    }
`