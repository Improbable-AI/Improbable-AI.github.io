import * as React from "react"
import "katex/dist/katex.min.css"

import styled from 'styled-components';

// styles
const StyledMain = styled.main`
  color: #232129;
  padding: 96px;
  font-family: Georgia, serif;
  font-size: 18px;
  line-height: 1.6;
  
  article {
    margin: 0 auto;
    padding: 0 2.5% 0 2.5%;
    width: 95%;
    max-width: 900px;
    
    h1 {
      font-family: FinancierDisplayWeb;
      font-size: 2em;
      line-height: 1.5em;
      text-align: left;
      font-weight: 400;
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
const IndexPage = ({children, ...props}) => {
  return (
      <StyledMain {...props}>
        <title>Improbable Blog</title>
        <article>
          {children}
        </article>
      </StyledMain>
  )
}

export default IndexPage
