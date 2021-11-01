import * as React from "react";
import {Link} from "gatsby";
import styled from "styled-components";

const StyledNavBar = styled.div`
  width: 100%;
  border-bottom: solid #eeeeee 1px;
  overflow: auto !important;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1000;
  
  .navbar-container {
  
    max-width: 900px;
    margin: 0 auto;
    height: 56px;
    
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    
    .spacer {
      flex: auto;
    }
    
    .navbar-item {
      color: black;
      text-decoration: none !important;
      height: 56px;
      padding: 0 14px;
      display: inline-flex;
      > div {
        margin: auto 0;
      }
      &:hover {
        background-color: #eeeeee;
      }
    }
    
    @media (min-width: 950px) {
      .navbar-item:first-child {
        margin-left: -14px;
      }
      .navbar-item:last-child {
        margin-right: -14px;
      }
    }
    
  }
`;

function NavBarItem({children, ...props}) {
  return <Link className="navbar-item" {...props}>
    <div>{children}</div>
  </Link>
}

function Spacer() {
  return <div className="spacer"/>
}

export function NavBar() {
  return <StyledNavBar>
    <div className="navbar-container">
      <NavBarItem to="/">Home</NavBarItem>
      <Spacer/>
      <NavBarItem to="/blog">Blog</NavBarItem>
    </div>
  </StyledNavBar>
}