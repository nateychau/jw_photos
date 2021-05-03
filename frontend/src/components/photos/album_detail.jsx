import React, { useEffect, useState } from "react";
import { PhotoItem } from "./photo_item";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import OnImagesLoaded from "react-on-images-loaded";
import { Hamburger } from "../hamburger";

export const AlbumPage = (props) => {
  const title = props.match.params.album;
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [filters, setFilters] = useState([]);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const url = `/api/album/${encodeURIComponent(title)}`;
      const res = await fetch(url);
      const data = await res.json();

      let tempFilters;
      let text = "";
      const temp = [];
      let i = 0; //counter to alternate the styling of each photo item
      for (let album in data) {
        if (!filters.length) {
          tempFilters = data[album]["filters"].map((item, i) => {
            return <li key={i}>{item}</li>;
          });
        }

        if (data[album]["text"].length) text = data[album]["text"];

        let link = data[album]["image"];
        let orientation = data[album]["orientation"];
        temp.push(
          <PhotoItem
            key={link}
            rowType={"album-row"}
            album={null}
            imgLink={link}
            orientation={orientation}
          />
        );
      }

      setPhotos(temp);
      setText(text);
      setFilters(tempFilters);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    //placeholder to hold page height
    <div id="album-page"> 
      <ClipLoader
        color={"#444444"}
        loading={isLoading}
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transition: all 1s
        `}
      />
      {isMobile ? <Hamburger topLink={"Home"} /> : null}
      {photos.length ? (
        <OnImagesLoaded
          onLoaded={() => setIsLoading(false)}
          onTimeout={() => setIsLoading(false)}
          timeout={7000}
        >
          <div className="album-body" style={{ opacity: isLoading ? 0 : 1 }}>
            <h1>{title}</h1>
            <ul>{filters}</ul>
            <p>{text}</p>
            <ul className="index-col">{photos}</ul>
          </div>
        </OnImagesLoaded>
      ) : null}
    </div>
  );
};
