import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import { Hamburger } from "./hamburger";

export const About = () => {
  const [page, setPage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const url = "/api/about";
      const res = await fetch(url);
      const data = await res.json();

      let fragments = data["text"].map((text, i) => {
        return <p key={i}>{text}</p>;
      });

      setPage({
        image: data["image"],
        text: fragments,
      });
    };

    fetchData();
  }, []);

  return (
    <div id="about-page">
      <ClipLoader
        color={"#444444"}
        loading={isLoading}
        css={css`
          position: absolute;
          top: 50%;
          left: 50%;
          transition: all 1s;
        `}
      />
      {isMobile ? <Hamburger topLink={"Home"} /> : null}
      <div className="about-row" style={{ opacity: isLoading ? 0 : 1 }}>
        <div className="col">
          <div className="img-container">
            <img
              onLoad={() => setIsLoading(false)}
              src={page ? page.image : null}
              style={{ display: isLoading ? "none" : "block" }}
            ></img>
          </div>
        </div>
        {isLoading ? null : (
          <div className="col">
            <h2>About</h2>
            {page ? page.text : null}
            <div className="link-container">
              <a href="mailto:joannw.photos@gmail.com">
                joannw.photos@gmail.com
              </a>
            </div>
            <div className="link-container">
              <a
                href="https://www.instagram.com/joannwphotos/?hl=en"
                target="_blank"
              >
                <i className="fab fa-instagram"></i>
                <p>joannwphotos</p>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
