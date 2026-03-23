// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import gamesInfo from './backend/games.json';

import { NavBar } from './components/NavBar';
import { Games } from './components/Games';
import { About } from './components/About';
import { Account } from './components/Account';
import { Settings } from './components/Settings';
import { NotReadyYet } from './components/NotReadyYet';
import { Wordle } from './components/wordle/Wordle';

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route path="/" element={<Games gamesInfo={gamesInfo}/>} />
          <Route path="about" element={<About />} />
          <Route path="account" element={<Account />} />
          <Route path="settings" element={<Settings />} />
          <Route path="snake" element={<NotReadyYet />} />
          <Route path="2048" element={<NotReadyYet />} />
          <Route path="wordle" element={<Wordle />} />
        </Routes>
      </BrowserRouter>
    </>
    
  );
}

export default App
