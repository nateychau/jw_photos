import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { Header } from "./header";
import { Body } from "./body";
import { AlbumPage } from "./photos/album_detail";
import { Footer } from "./footer";
import { About } from "./about";

export const Root = () => {
  return (
    <HashRouter>
      <Header />
      <Switch>
        <Route path="/about" component={About} />
        <Route path="/album/:album" component={AlbumPage} />
        <Route path="/" component={Body}/>
      </Switch>
      <Footer />
    </HashRouter>
  );
};
