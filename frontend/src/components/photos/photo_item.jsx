import React from "react";
import { Link } from "react-router-dom";

export const PhotoItem = ({ album, imgLink, rowType }) => {
  const image =
    rowType !== "album-row" ? ( //if rowType is not null, then this component is on the index page and should be wrapped in a link
      <Link to={`/album/${album}`}>
        <div className={"img-container"}>
          <img src={imgLink}></img>
        </div>
      </Link>
    ) : (
      <div className={"img-container"}>
        <img src={imgLink}></img>
      </div>
    );

  return (
    <li className={`index-row ${rowType}`}>
      {image}
      <h2>{album}</h2>
    </li>
  );
};
