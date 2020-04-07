import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import jwtDecode from "jwt-decode";

import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";

//components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NavBar from "./components/NavBar";
import AuthRoute from "./components/AuthRoute";

import "./App.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#00bcd4",
      dark: "#008394",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff"
    }
  }
});

const token = localStorage.getItem("FBToken");

if (token) {
  const decodedToken = jwtDecode(token);

  if (decodedToken.exp * 1000 < new Date()) {
    window.location.href = "/login";
  }
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <NavBar />
          <div className="container">
            <Route exact path="/" component={Home} />
            <AuthRoute path="/Login" component={Login} />
            <AuthRoute path="/Signup" component={Signup} />
          </div>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
