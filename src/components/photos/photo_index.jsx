import React, { useEffect, useState } from "react";
import { PhotoItem } from "./photo_item";


export const PhotoIndex = ({filter}) => {
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      console.log('fetching');
      const res = await fetch('http://localhost:5000/api/covers')
      const data = await res.json();

      let temp = [] 

      for(let album in data) { 
        let link = data[album]
        temp.push(<PhotoItem key={album} album={album} imgLink={link} />);
      }

      setIsLoading(false);
      setPhotos(temp);
      console.log(photos);
    };

    fetchData();
  }, []); 

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