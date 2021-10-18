import React from "react"

// export default function Video ({src}) {
//   return <div>this is working</div>;
// }

export default function Video({src, alt, videoTitle, ...props}) {
  if (src.endsWith(".mp4")) return (
      <video controls>
        <source src={src} alt={alt} type="video/mp4"/>
      </video>);
  else return (
      <div className="video" alt={alt}>
        <iframe
            src={src}
            title={videoTitle || alt}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allowFullScreen
        />
      </div>);
}