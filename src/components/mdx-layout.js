import * as React from "react"
import "katex/dist/katex.min.css"

import styled from 'styled-components';
import joinArray from "./joinArray";

// styles
const StyledMain = styled.main`
  font-family: Georgia, serif;
  font-size: 18px;
  line-height: 1.6;
  
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
      font-size: 1.2em;
      line-height: 1.4em;
    }
    h2 {
      font-size: 1.2em;
      font-weight: 500;
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
  console.log(pageContext.frontmatter.title);
  const author_list = pageContext.frontmatter.authors.map((author) => <span>{author}</span>)
  const author_plug = joinArray(author_list, ', ')
  return (
      <StyledMain {...props}>
        <title>{pageContext.frontmatter.title || "Improbable Blog"}</title>
        <div className="hero">
          <div className="hero-text">
            <h1 className="title-block">{pageContext.frontmatter.title}</h1>
            <p>written by {author_plug}</p>
          </div>
        </div>
        <article>
          {children}
        </article>
      </StyledMain>
  )
}

export default IndexPage
