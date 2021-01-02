import React from "react";
import { Link } from "react-router-dom";
import { getRandomArbitrary } from "../../util/util";

export const PhotoItem = ({ album, imgLink, rowType }) => {
  const image = rowType !== "album-row" ? ( //if rowType is not null, then this component is on the index page and should be wrapped in a link
    <Link to={`/${album}`}>
      <img src={imgLink}></img>
    </Link>
  ) : (
    <img src={imgLink}></img>
  );

  return (
    <li className={`index-row ${rowType}`}>
      <div className={"img-container"}>{image}</div>
      <h2>{album}</h2>
    </li>
  );
};
