import React, { useEffect, useState } from "react";
import { PhotoItem } from "./photo_item";

export const AlbumPage = (props) => {
  const title = props.match.params.album;
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:5000/api/album/${encodeURIComponent(
        title
      )}`;
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
        let description = data[album]["description"];
        temp.push(
          <PhotoItem
            key={link}
            rowType={"album-row"}
            album={description}
            imgLink={link}
          />
        );
      }

      setIsLoading(false);
      setPhotos(temp);
      setText(text);
      setFilters(tempFilters);
    };

    fetchData();
  }, []);

  return (
    <div className="album-body">
      <h1>{title}</h1>
      <ul>{filters}</ul>
      <p>{text}</p>
      <ul className="index-col">{photos}</ul>
    </div>
  );
};
