import React, { useState, useEffect } from "react";
import { PhotoIndex } from "./photos/photo_index";
import { Hamburger } from "./hamburger";

export const Body = () => { 
  const [filter, setFilter] = useState(null);
  const [filterList, setList] = useState(null);
  const [isLoading, setLoading] = useState(true);

   //TODO: add listener for window resizing
   const isMobile = window.matchMedia("(max-width: 768px)").matches;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const res = await fetch("/api/filters");
      const data = await res.json();

      const temp = data["options"].map((item, i) => {
        let filterItem = item["value"];
        return (
          <li
            key={i}
            onClick={() => {
              setFilter(filterItem.toLowerCase());
            }}
          >
            {filterItem}
          </li>
        );
      });

      setList(temp);
      setLoading(false);
    };

    fetchData();
  }, []);

  const menu = isMobile ? (
    <Hamburger
      filterList={filterList}
      clearFilter={() => setFilter(null)}
      topLink={"All"}
    />
  ) : (
    <ul className="filter-list">
      <li
        key={-1}
        onClick={() => {
          setFilter(null);
        }}
        style={{ opacity: isLoading ? 0 : 1 }}
      >
        all
      </li>
      {filterList}
    </ul>
  );

  return (
    // Should probably generate this list dynamically
    <div className="main-body">
      {menu}
      <PhotoIndex filter={filter} />
    </div>
  );
};
