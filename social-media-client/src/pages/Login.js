import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";

const styles = {
  form: {
    textAlign: "center"
  }
};

function Login(props) {
  return (
    <>
      <Grid container className={props.classes.form}>
        <Grid item sm />
        <Grid item sm>
          <p>image placeholder</p>
          <Typography variant="h2" className={props.classes.pageTitle}>
            Login
          </Typography>
        </Grid>
        <Grid item sm />
      </Grid>
    </>
  );
}

export default withStyles(styles)(Login);
