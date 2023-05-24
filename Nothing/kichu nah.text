import './App.css';
import Navbar from './components/Navbar.js';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import SellNFT from './components/SellNFT';
import NFTPage from './components/NFTpage';
import Login from './components/Login';
import ReactDOM from "react-dom/client";

import {BrowserRouter, Routes , Route} from "react-router-dom";


// import cors from 'cors';
// const express = require('express')
// const app = express()
// app.use(cors({
//   origin: 'http://127.0.0.1:3000',
// }))



function App() {
  return (
    <div className="container">
      <Routes >
          <Route path="/" element={<Marketplace />} />
          <Route path="/nftPage" element={<NFTPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sellNFT" element={<SellNFT />} />
          <Route path="/login" element={<SellNFT />} />

      </Routes >
    </div>
  );
}

export default App;



