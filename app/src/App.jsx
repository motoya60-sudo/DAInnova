import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import Sidebar  from './components/Sidebar'
import Home from "./pages/Home";
import Login from "./pages/Login";
import ExternalArchive from "./pages/ExternalArchive";
import Map3D from "./pages/Map3D";
import ArchiveManager from "./pages/ArchiveManager";
import Create from "./pages/Create";

export default function App() {
  return (
    <Router>
      <div>
        <Sidebar />
        <main style={{ marginLeft: "220px", padding: "16px", minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/external-archive" element={<ExternalArchive />} />
            <Route path="/map3d" element={<Map3D />} />
            <Route path="/manage" element={<ArchiveManager />} />
            <Route path="/create" element={<Create />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
