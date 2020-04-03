import React, { useState } from "react";

//mui imports
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";

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
  const [formData, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    handle: "",
    loading: false,
    errors: {
      email: "",
      password: "",
      handle: ""
    }
  });

  const handleChanges = e => {
    setData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setData({ ...formData, loading: true });
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
              helperText={formData.errors.email}
              error={formData.errors.email ? true : false}
              className={props.classes.textField}
            />
            <TextField
              type="password"
              name="password"
              label="password"
              value={formData.password}
              onChange={handleChanges}
              fullWidth
              helperText={formData.errors.password}
              error={formData.errors.password ? true : false}
              className={props.classes.textField}
            />
            <TextField
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChanges}
              fullWidth
              helperText={formData.errors.password}
              error={formData.errors.password}
              className={props.classes.textField}
            />
            <TextField
              type="text"
              name="handle"
              label="Handle"
              value={formData.handle}
              onChange={handleChanges}
              fullWidth
              helperText={formData.errors.password}
              error={formData.errors.password}
              className={props.classes.textField}
            />
            <Button
              variant="contained"
              color="primary"
              className={props.classes.button}
              onClick={handleSubmit}
              disabled={formData.loading}
            >
              {formData.loading ? "Loading..." : "Signup!"}
            </Button>
          </form>
        </Grid>
        <Grid sm item />
      </Grid>
    </>
  );
}

export default withStyles(styles)(Signup);
