import React, { useState } from "react";
//react router
import { Link } from "react-router-dom";

//mui imports
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";

//redux imports
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/UserActions";

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

function Signup(props) {
  console.log("signup props", props);
  const [formData, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    handle: ""
  });

  const handleChanges = e => {
    setData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setData({ ...formData, loading: true });
    const newUser = {
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      handle: formData.handle
    };
    props.signupUser(newUser, props.history);
  };
  return (
    <>
      <Grid container className={props.classes.form}>
        <Grid sm item />
        <Grid sm item>
          <p>item placeholder</p>
          <Typography variant="h2" className={props.classes.pageTitle}>
            Signup
          </Typography>
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChanges}
              fullWidth
              label="Email"
              helperText={props.errors.email}
              error={props.errors.email ? true : false}
              className={props.classes.textField}
            />
            <TextField
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChanges}
              fullWidth
              helperText={props.errors.password}
              error={props.errors.password ? true : false}
              className={props.classes.textField}
            />
            <TextField
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChanges}
              fullWidth
              helperText={props.errors.confirmPassword}
              error={props.errors.confirmPassword ? true : false}
              className={props.classes.textField}
            />
            <TextField
              type="text"
              name="handle"
              label="Handle"
              value={formData.handle}
              onChange={handleChanges}
              fullWidth
              helperText={props.errors.handle}
              error={props.errors.handle ? true : false}
              className={props.classes.textField}
            />
            <Button
              variant="contained"
              color="primary"
              className={props.classes.button}
              onClick={handleSubmit}
              disabled={props.loading}
            >
              {props.loading ? "Loading..." : "Signup!"}
            </Button>
          </form>
          <p>
            Already have an account? click <Link to="/login">here</Link>
          </p>
        </Grid>
        <Grid sm item />
      </Grid>
    </>
  );
}

const mapStateToProps = state => ({
  loading: state.UiReducer.loading,
  errors: state.UiReducer.errors
});

export default connect(mapStateToProps, { signupUser })(
  withStyles(styles)(Signup)
);
