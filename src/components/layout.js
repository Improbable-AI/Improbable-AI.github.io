import * as React from "react"
import "katex/dist/katex.min.css"

import styled from 'styled-components';

// styles
const StyledMain = styled.main`
  color: #232129;
  padding: 96px;
  font-size: 16px;
  font-family: Lato;
  // font-family: times new roman, -apple-system, Roboto, sans-serif, serif;
  line-height: 1.3em;
  
  article {
    margin: 0 auto;
    padding: 0 2.5% 0 2.5%;
    width: 95%;
    max-width: 900px;
    
    h1 {
      font-family: Lato;
      font-size: 2em;
      line-height: 1.5em;
      text-align: left;
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
        <link href='http://fonts.googleapis.com/css?family=Lato:400,700' rel='stylesheet' type='text/css'/>
      </StyledMain>
  )
}

export default IndexPage
