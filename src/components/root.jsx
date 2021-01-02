import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { Header } from "./header";
import { Body } from "./body";
import { AlbumPage } from "./photos/album_detail";

export const Root = () => {
  return (
    <HashRouter>
      <Header />
      <Switch>
        <Route path="/:album" component={AlbumPage} />
        <Route path="/" component={Body}/>
      </Switch>
    </HashRouter>
  );
};
