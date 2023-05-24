import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import SellNFT from './components/SellNFT';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import NFTPage from './components/NFTpage';
import Login from './components/Login';
import Registration from './components/Registration';
import History from './components/History';

// import express from 'express';
// var app = express();
// import cors from'cors';
// app.use(cors());





const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Marketplace />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/sellNFT" element={<SellNFT />} />
        <Route path="/nftPage/:tokenId" element={<NFTPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Login />} />


      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
