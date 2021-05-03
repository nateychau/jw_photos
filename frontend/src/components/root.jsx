import React, { useRef } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { Header } from './header';
import { Body } from './body';
import { AlbumPage } from './photos/album_detail';
import { Footer } from './footer';
import { About } from './about';
import ScrollToTop from './scroll';
import { AppProvider } from '../context/AppContext';

export const Root = () => {
  return (
    <HashRouter>
      <AppProvider>
        <ScrollToTop />
        <Header />
        <Switch>
          <Route path='/about' component={About} />
          <Route path='/album/:album' component={AlbumPage} />
          <Route path='/' component={Body} />
        </Switch>
        <Footer />
        <i
          onClick={() => window.scrollTo(0, 0)}
          className='fas fa-angle-double-up'
        ></i>
      </AppProvider>
    </HashRouter>
  );
};
