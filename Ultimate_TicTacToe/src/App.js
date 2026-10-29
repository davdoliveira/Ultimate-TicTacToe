import React from 'react';
import Game from './Game.js';
import Header from './Header.js';
import Footer from './Footer.js';

export default function App() {
  return (
    <div className="app">
      <Header />
      <Game />
      <Footer />
    </div>
  );
}
