import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  
  return (
    <div className="header">
      <Link to="/">
        <img id="logo" src="https://raw.githubusercontent.com/nateychau/jw_photos/main/frontend/src/assets/images/134475128_220419899756208_4321904324139576771_n.png"></img>
        <h2>Joann W Photos</h2>
      </Link>
      {isMobile ? null : (
        <Link to="/about">
          <h4>About</h4>
        </Link>
      )}
    </div>
  );
};
