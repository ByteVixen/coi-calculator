import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import FAQ from "./pages/FAQ";

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Router>
      {/* Header */}
      <header className="bg-green-600 text-white p-4 flex justify-between items-center shadow-lg relative">
        <div className="flex items-center space-x-4">
          <img src="/logocoi.png" alt="COI Calculator Logo" className="h-10 w-10 rounded-full" />
          <span className="text-2xl font-bold">COI Calculator</span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:underline text-lg" onClick={closeMenu}>Home</Link>
          <Link to="/faq" className="hover:underline text-lg" onClick={closeMenu}>FAQ</Link>
        </nav>

        {/* Mobile Burger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="absolute top-16 right-4 bg-green-700 p-4 rounded-lg flex flex-col space-y-4 md:hidden z-50">
            <Link to="/" className="hover:underline text-lg" onClick={closeMenu}>Home</Link>
            <Link to="/faq" className="hover:underline text-lg" onClick={closeMenu}>FAQ</Link>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="p-6">
  <AnimatePresence mode="wait">
    <Routes>
      <Route
        path="/"
        element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Home />
          </motion.div>
        }
      />
      <Route
        path="/faq"
        element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FAQ />
          </motion.div>
        }
      />
    </Routes>
  </AnimatePresence>
</main>

      {/* Footer */}
      <footer className="bg-green-600 text-white text-center p-4 mt-12 text-sm">
  © 2025 COI Calculator by{" "}
  <span
    className="font-bold"
    style={{
      fontFamily: "Splash, cursive",
      fontSize: "1.5rem", // 🔥 bigger size
      display: "inline-block",
      marginLeft: "0.5rem",
    }}
  >
    ByteVixen
  </span>
</footer>
    </Router>
  );
};

export default App;
