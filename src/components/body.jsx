import React, { useState, useEffect } from "react";
import { PhotoIndex } from "./photos/photo_index";

export const Body = () => {
  const [filter, setFilter] = useState(null);
  const [filterList, setList] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:5000/api/filters");
      const data = await res.json();

      const temp = data["options"].map((item, i) => {
        let filterItem = item["value"];
        return <li key={i} onClick={() => setFilter(filterItem)}>{filterItem}</li>
      }) 

      setList(temp);
    };

    fetchData();
  }, []);

  return (
    // Should probably generate this list dynamically
    <div className="main-body">
      <ul className="filter-list">
        {filterList}
      </ul>
      <PhotoIndex filter={filter} /> 
    </div>
  );
};
