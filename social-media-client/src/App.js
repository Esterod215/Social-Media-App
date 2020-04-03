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
let authenticated = false;
if (token) {
  const decodedToken = jwtDecode(token);
  console.log("dectoken", decodedToken);
  if (decodedToken.exp * 1000 < new Date()) {
    window.location.href = "/login";
    authenticated = false;
  } else {
    authenticated = true;
  }
} else {
  console.log("no token");
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <NavBar />
          <div className="container">
            <Route exact path="/" component={Home} />
            <AuthRoute
              path="/Login"
              component={Login}
              authenticated={authenticated}
            />
            <AuthRoute
              path="/Signup"
              component={Signup}
              authenticated={authenticated}
            />
          </div>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
