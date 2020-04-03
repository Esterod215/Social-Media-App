import React, { useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
//mui imports
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";

const styles = {
  form: {
    textAlign: "center"
  },
  pageTitle: {
    marginTop: "10px"
  },
  button: {
    marginTop: "20px;",
    marginBottom: "10px"
  },
  textField: {
    margin: "10px auto 10px auto"
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: "10px"
  }
};

function Login(props) {
  const [values, setValues] = useState({
    email: "",
    password: "",
    loading: false,
    errors: { email: "", general: "", password: "" }
  });

  const handleSubmit = e => {
    e.preventDefault();
    setValues({ ...values, loading: true });
    const userData = { email: values.email, password: values.password };
    axios
      .post(
        "https://us-central1-socialapp-2a20a.cloudfunctions.net/api/login",
        userData
      )
      .then(res => {
        console.log(res);
        localStorage.setItem("FBToken", `Bearer ${res.data.token}`);
        props.history.push("/");
      })
      .catch(err => {
        setValues({ ...values, errors: err.response.data, loading: false });
      });
  };

  const handleChanges = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Grid container className={props.classes.form}>
        <Grid item sm />
        <Grid item sm>
          <p>image placeholder</p>
          <Typography variant="h2" className={props.classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={props.classes.textField}
              value={values.email}
              onChange={handleChanges}
              fullWidth
              helperText={values.errors.email}
              error={values.errors.email ? true : false}
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={props.classes.textField}
              value={values.password}
              onChange={handleChanges}
              helperText={values.errors.password}
              error={values.errors.password ? true : false}
              fullWidth
            />
            {values.errors.general ? (
              <Typography variant="body2" className={props.classes.customError}>
                {values.errors.general}
              </Typography>
            ) : null}
            <Button
              variant="contained"
              color="primary"
              className={props.classes.button}
              onClick={handleSubmit}
              disabled={values.loading}
            >
              {values.loading ? <CircularProgress /> : "Login"}
            </Button>
            <br />
            <small>
              Dont have an account? Signup <Link to="/Signup">here.</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    </>
  );
}

export default withStyles(styles)(Login);
