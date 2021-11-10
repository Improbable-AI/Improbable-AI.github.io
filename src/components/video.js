import React from "react";
import styled from "styled-components";

export const FigureRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
  width: 100%;
`;

export const Figure = styled.figure`
  display: flex;
  flex-direction: column;
  justify-items: center;
  ${({width}) => width ? `width: ${width};` : ''}
  ${({maxWidth}) => maxWidth ? `max-width: ${maxWidth};` : ''}
  ${({gap}) => gap ? `gap: ${gap};` : ''}
  
  img {
    width: 100%;
  }
  
  figcaption {
    margin-top: 0.6em;
    font-style: italic;
    color: #999;
    text-align: center;
  }
`;

export const Spacer = styled.div`
  flex: auto;
`;

//Ge - currently not being used.
export const Image = ({
                         src, alt, title, caption, align = "center",
                         ...props
                       }) => (
    <Figure className="figure-container" {...props}>
      {title ? <h3>{title}</h3> : null}
      <img src={src} />
      {caption
          ? <figcaption className="caption">{caption}</figcaption>
          : null}
    </Figure>);

export default function Video({
                                src,
                                alt,
                                title,
                                caption,
                                align = "center",
                                width,
                                gap,
                                ...props
                              }) {
  if (src.endsWith(".mp4")) {
    if (title || caption) {
      // if "%" in width:
      return (
          <Figure className="video-container" style={{width: width, gap: gap}}>
            {title ? <h3 style={{width: "100%"}}>{title}</h3> : null}
            <video controls style={{width: "100%"}} {...props}>
              <source src={src} type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
            {caption
                ? <figcaption className="caption" style={{width: "100%"}}>{caption}</figcaption>
                : null}
          </Figure>
      );
    } else return (
        <video controls {...props}>
          <source src={src} alt={alt} type="video/mp4"/>
          Your browser does not support the video tag.
        </video>
    );
  } else return (
      <div className="video" alt={alt} {...props}>
        <iframe
            src={src}
            title={title || alt}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowFullScreen
        />
      </div>);
}