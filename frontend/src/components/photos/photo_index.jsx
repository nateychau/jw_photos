import React, { useEffect, useState } from "react";
import { PhotoItem } from "./photo_item";

export const PhotoIndex = ({ filter }) => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); //will be used for a loading wheel when fetching

      const url = "/api/covers"; //add route for filtering cover photos to avoid filtering below
      const res = await fetch(url);
      const data = await res.json();

      let temp = [];
      let i = 0; //counter to alternate the styling of each photo item
      for (let album in data) {
        if (filter && !data[album]["filters"].includes(filter)) continue; //may want to consider handling filtering elsewhere, or some other way. this does not scale

        let link = data[album]["image"];
        temp.push(
          <PhotoItem
            key={i}
            rowType={i % 2 === 0 ? "cornered-row" : "centered-row"}
            album={album}
            imgLink={link}
          />
        );
        i++;
      }

      setIsLoading(false);
      setPhotos(temp);

    };

    fetchData();
  }, [filter]);

  return (
    <div className="photo-index">
      <ul className="index-col col-left">
        {photos.slice(0, photos.length / 2)}
      </ul>
      <ul className="index-col col-right">
        {photos.slice(photos.length / 2, photos.length)}
      </ul>
    </div>
  );
};
