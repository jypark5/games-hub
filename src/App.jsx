// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import gamesInfo from './backend/games.json';

import { NavBar } from './components/NavBar';
import { Games } from './components/Games';
import { About } from './components/About';

function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route path="/" element={<Games gamesInfo={gamesInfo}/>} />
          <Route path="about" element={<About />} />

        </Routes>
      </BrowserRouter>
    </>
    
  );
}

export default App
