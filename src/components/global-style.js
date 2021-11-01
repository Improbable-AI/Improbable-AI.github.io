import {createGlobalStyle} from "styled-components";
// import "prismjs/themes/prism-okaidia.css";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0 !important;
    font-family: Georgia, serif;
    font-size: 16px;
    line-height: 1.6;
  }
  
  .gatsby-highlight-code-line {
    background-color: #feb;
    display: block;
    margin-right: -1em;
    margin-left: -1em;
    padding-right: 1em;
    padding-left: 0.75em;
    border-left: 0.25em solid #f99;
  }
  
  /**
   * Add back the container background-color, border-radius, padding, margin
   * and overflow that we removed from pre.
   */
  @import url(https://cdn.rawgit.com/tonsky/FiraCode/1.205/distr/fira_code.css);
  code {
    font-family: "Fira Code";
    font-size: 0.85em;
  }
  /** inline style */ 
  p > code {
    background-color: #f0f0f090;
    color: #23aaff;
    border-radius: 0.25em;
    padding: 0 0.25em;
  }
  .gatsby-highlight {
    background-color: #272822;
    border-radius: 0.3em;
    margin: 1em 0;
    padding: 0.5em 1em;
    overflow: auto;
    color: #f8f8f8;
    line-height: 1.4em;
    > pre {
      margin: 0;
    }
  }
  
  .gatsby-highlight[data-language=text] {
    background-color: #ccc;
    color: black;
  }

  // /**
  //  * Remove the default PrismJS theme background-color, border-radius, margin,
  //  * padding and overflow.
  //  * 1. Make the element just wide enough to fit its content.
  //  * 2. Always fill the visible space in .gatsby-highlight.
  //  * 3. Adjust the position of the line numbers
  //  */
  // .gatsby-highlight pre[class*="language-"] {
  //   background-color: transparent;
  //   margin: 0;
  //   padding: 0;
  //   overflow: initial;
  //   float: left; /* 1 */
  //   min-width: 100%; /* 2 */
  // }
`