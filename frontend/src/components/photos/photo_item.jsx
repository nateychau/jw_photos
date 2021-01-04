import React from "react";
import { Link } from "react-router-dom";

export const PhotoItem = ({ album, imgLink, rowType, orientation }) => {
  const image =
    rowType !== "album-row" ? ( //if rowType is not null, then this component is on the index page and should be wrapped in a link
      <Link to={`/album/${album}`}>
        <div className={`img-container ${orientation}`}>
          <img src={imgLink}></img>
          <h2>{album}</h2>
        </div>
      </Link>
    ) : (
      <div className={`img-container ${orientation}`}>
        <img src={imgLink}></img>
        <h2>{album}</h2>
      </div>
    );

  return (
    <li className={`index-row ${rowType}`}>
      {image}
    </li>
  );
};
