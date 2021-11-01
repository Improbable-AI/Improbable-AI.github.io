import React from "react";
import styled from "styled-components";

export const FigureRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
`;

const Figure = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
`;

export const Spacer = styled.div`
  flex: auto;
`;

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
                ? <div className="caption" style={{width: "100%"}}>{caption}</div>
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