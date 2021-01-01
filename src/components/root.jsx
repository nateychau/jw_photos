import React from "react";
import { HashRouter } from "react-router-dom";
import { Header } from "./header";
import { Body } from "./body";

export const Root = () => {
  return (
    <HashRouter>
      <Header />
      <Body />
    </HashRouter>
  );
};