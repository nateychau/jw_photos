import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="header">
      <Link to="/">
        <h2>Joann W Photos</h2>
      </Link>
      <Link to="/about">
        <h4>About</h4>
      </Link>
    </div>
  );
};
