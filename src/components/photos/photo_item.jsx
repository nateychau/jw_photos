import React from "react";

export const PhotoItem = ({album, imgLink}) => {
  return (
    <li className="index-row">
      <div className="img-container">
        <img src={imgLink}></img>
      </div>
      <h2>{album}</h2>
    </li>
  )
}