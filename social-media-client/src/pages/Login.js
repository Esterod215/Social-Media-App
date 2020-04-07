import React, { useState } from "react";
import { Link } from "react-router-dom";

//mui imports
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";

//redux
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/UserActions";

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
    password: ""
  });

  const handleSubmit = e => {
    e.preventDefault();
    const userData = { email: values.email, password: values.password };
    props.loginUser(userData, props.history);
  };

  const handleChanges = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  console.log("props", props);

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
              helperText={props.UI.errors.email}
              error={props.UI.errors.email ? true : false}
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={props.classes.textField}
              value={values.password}
              onChange={handleChanges}
              helperText={props.UI.errors.password}
              error={props.UI.errors.password ? true : false}
              fullWidth
            />
            {props.UI.errors.general ? (
              <Typography variant="body2" className={props.classes.customError}>
                {props.UI.errors.general}
              </Typography>
            ) : null}
            <Button
              variant="contained"
              color="primary"
              className={props.classes.button}
              onClick={handleSubmit}
              disabled={props.UI.loading}
            >
              {props.UI.loading ? <CircularProgress /> : "Login"}
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

const mapStateToProps = state => ({
  user: state.userReducer,
  UI: state.UiReducer
});

export default connect(mapStateToProps, { loginUser })(
  withStyles(styles)(Login)
);
