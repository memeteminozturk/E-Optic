import { useState, useEffect } from "react";
import "./App.css";
import "./styles/theme.css";
import { Route, Routes } from "react-router-dom";
import OpticPage from "./pages/OpticPage";
import OpticEditPage from "./pages/OpticEditPage";
import ReviewPage from "./pages/ReviewPage";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollTop from "./components/ScrollTop";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<OpticPage />} />
        <Route path="/edit" element={<OpticEditPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
      <Footer />
      <ScrollTop />
      <Toaster
        toastOptions={{
          style: {
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-primary)",
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;
