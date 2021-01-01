import React, { useState } from "react";

export const Body = () => {
  const [filter, setFilter] = useState(null);

  return (
    // Should probably generate this list dynamically
    <div className="main-body">
      <ul className="filter-list">
        <li onClick={() => setFilter(1)}>Category 1</li>
        <li onClick={() => setFilter(2)}>Category 2</li>
      </ul>
    </div>
  );
};
