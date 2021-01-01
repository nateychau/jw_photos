import React, { useEffect, useState } from "react";
import { PhotoItem } from "./photo_item";


export const PhotoIndex = ({filter}) => {
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/covers')
      .then(res => res.json())
      .then(res => {
        let temp = [];

        for(let album in res) { 
          let link = res[album]
          temp.push(<PhotoItem key={album} album={album} imgLink={link} />);
        }

        setPhotos(temp);
      });
  }); 

  return (
    <div className="photo-index">
      <ul className="index-col">
        {photos.slice(0, photos.length/2)}
      </ul>
      <ul className="index-col">
        {photos.slice(photos.length/2, photos.length)}
      </ul>
    </div>
  );
}