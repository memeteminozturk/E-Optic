import { useState, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import OpticPage from "./pages/OpticPage";
import OpticEditPage from "./pages/OpticEditPage";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<OpticPage />} />
        <Route path="/edit" element={<OpticEditPage />} />
      </Routes>
      <Footer />
      <Toaster />
    </>
  );
}

export default App;
