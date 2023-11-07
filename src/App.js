import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import EventDetails from "./views/EventDetails";
import HomePage from "./views/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
