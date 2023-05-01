import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../routes/Home";
import Auth from "../routes/Auth";

const AppRouter = ({ isLoggedIn }) => {
  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
