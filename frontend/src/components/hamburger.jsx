import React, { useState } from "react";
import HamburgerMenu from "react-hamburger-menu";
import { Link, withRouter } from "react-router-dom";

const HamburgerComponent = ({ filterList, clearFilter, topLink, history }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className={isOpen ? "mobile-menu open" : "mobile-menu closed"}>
      <HamburgerMenu
        isOpen={isOpen}
        menuClicked={() => {
          document.body.classList.toggle("menu-open");
          setOpen(!isOpen);
        }}
        width={24}
        height={18}
      />
      <ul
        onClick={() => {
          document.body.classList.toggle("menu-open");
          setOpen(false)}
        }
        className="mobile-menu-list"
        style={{opacity: isOpen ? 1 : 0/*, display: isOpen ? "block" : "none" */}}
      >
        <li
          key={-1}
          onClick={() => {
            clearFilter ? clearFilter() : (history.push("/")); //if clearFilter is null, we are coming from about page
          }}
        >
          {topLink}
        </li>
        {filterList}
        <Link to="/about">
          <li>About</li>
        </Link>
      </ul>
    </div>
  );
};

export const Hamburger = withRouter(HamburgerComponent);