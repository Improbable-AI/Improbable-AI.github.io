import * as React from "react"
import "katex/dist/katex.min.css"
import {MDXProvider} from "@mdx-js/react";
import styled from "styled-components"
import joinArray from "./joinArray";
import {NavBar} from "./navbar";
import {GlobalStyle} from "./global-style";

// styles
const StyledMain = styled.main`
 
  .hero {
    // background: blue;
    width: 100%;
    border-bottom: solid gray 1px;
    margin-bottom: 3em;
    .hero-text {
      margin: 0 auto;
      padding: 0 2.5% 0 2.5%;
      width: 95%;
      max-width: 900px;
    }
  }
  
  h1.title-block {
    font-size: 2em;
    font-family: FinancierDisplayWeb;
    line-height: 1.7em;
    text-align: left;
    font-weight: 400;
  }
  article {
    margin: 0 auto;
    padding: 0 2.5% 0 2.5%;
    width: 95%;
    max-width: 900px;
    
    h1 {
      font-size: 1.5em;
      line-height: 1.4em;
      margin: 2em 0 1em;
    }
    h2 {
      font-size: 1.2em;
      font-weight: 700;
      text-transform: capitalize;
    }
    
    p {
      text-align: justify;
    }
    
    .footnotes li {
      margin-bottom: 1em;
    }
    
  }
`

// markup
const IndexPage = ({pageContext, children, ...props}) => {
  let author_plug, title;
  if (pageContext.frontmatter) {
    title = pageContext.frontmatter.title || title
    if (pageContext.frontmatter.authors) {
      const author_list = pageContext.frontmatter.authors.map((author) => <span>{author}</span>)
      author_plug = joinArray(author_list, ', ')
    }
  }
  return (
      <StyledMain {...props}>
        <GlobalStyle/>
        <title>{title || "Improbable AI"}</title>
        <NavBar/>
        {title
            ? <div className="hero">
              <div className="hero-text">
                <h1 className="title-block">{title}</h1>
                {author_plug ? <p>written by {author_plug}</p> : null}
              </div>
            </div> : null}
        <MDXProvider>
          <article>
            {children}
          </article>
        </MDXProvider>
      </StyledMain>
  )
}

export default IndexPage