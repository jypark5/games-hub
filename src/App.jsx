// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import { NavBar } from './components/NavBar';
import { Home } from './components/Home';
import { About } from './components/About';

function App() {
  // const games = JSON.parse("./backend/games.json");

  return (
    <>
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />

        </Routes>
      </BrowserRouter>
    </>
    
  );
}

export default App
