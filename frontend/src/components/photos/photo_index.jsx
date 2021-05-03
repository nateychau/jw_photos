import React, { useEffect, useState } from "react";
import { PhotoItem } from "./photo_item";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import OnImagesLoaded from "react-on-images-loaded";

export const PhotoIndex = ({ filter }) => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); //will be used for a loading wheel when fetching
      setPhotos([]);
      const url = `/api/covers${
        filter ? "/" + encodeURIComponent(filter) : ""
      }`; //apply filter to request if a filter was selected
      const res = await fetch(url);
      const data = await res.json();

      let temp = [];
      let i = 0; //counter to alternate the styling of each photo item
      for (let album in data) {
        // if (filter && !data[album]["filters"].includes(filter)) continue; //may want to consider handling filtering elsewhere, or some other way. this does not scale

        let link = data[album]["image"];
        let orientation = data[album]["orientation"];

        temp.push(
          <PhotoItem
            key={i}
            rowType={i % 2 === 0 ? "cornered-row" : "centered-row"}
            album={album}
            imgLink={link}
            orientation={orientation}
          />
        );
        i++;
      }

      setPhotos(temp);
      setIsLoading(false);
    };

    fetchData();
  }, [filter]);

  return (
    <>
      <ClipLoader
        color={"#444444"}
        loading={isLoading}
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
        `}
      />
      {photos.length ? (
        <OnImagesLoaded
          onLoaded={() => setIsLoading(false)}
          onTimeout={() => setIsLoading(false)}
          timeout={7000}
        >
          <div className="photo-index" style={{ opacity: isLoading ? 0 : 1 }}>
            <ul className="index-col col-left">
              {photos.slice(0, photos.length / 2)}
            </ul>
            <ul className="index-col col-right">
              {photos.slice(photos.length / 2, photos.length)}
            </ul>
          </div>
        </OnImagesLoaded>
      ) : null}
    </>
  );
};
