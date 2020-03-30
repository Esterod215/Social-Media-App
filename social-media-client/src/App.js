import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Home} />
        <Route path="/Login" component={Login} />
        <Route path="/Signup" component={Signup} />
      </Router>
    </div>
  );
}

export default App;
