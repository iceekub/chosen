import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Inquire from "./pages/Inquire";
import About from "./pages/About";
import { Privacy, Terms } from "./pages/Legal";
import ScrollToTop from "./components/ScrollToTop";

/**
 * CHOSEN - Corporate Site
 * Main entry point with routing for pre-launch phase and beyond.
 */

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/inquire" element={<Inquire />} />
        <Route path="/waitlist" element={<Inquire />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  );
};

export default App;
