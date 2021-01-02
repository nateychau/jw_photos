import React from "react";
import { getRandomArbitrary } from "../../util/util";

export const PhotoItem = ({album, imgLink, rowType}) => {

  return (
    <li className={`index-row ${rowType}`}>
      <div className={"img-container"}>
        <img src={imgLink}></img>
      </div>
      <h2>{album}</h2>
    </li>
  )
}