import React, { useEffect, useState } from "react";
import { PhotoItem } from "./photo_item";

export const PhotoIndex = ({ filter }) => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); //will be used for a loading wheel when fetching

      const res = await fetch("http://localhost:5000/api/covers");
      const data = await res.json();

      let temp = [];
      let i = 0; //counter to alternate the styling of each photo item
      for (let album in data) {
        let link = data[album];
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
  }, []);

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
