import React from "react";
import { Link } from "react-router-dom";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
//MUI imports
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20
  },
  content: {
    padding: 25,
    objectFit: "cover"
  }
};

function Scream(props) {
  dayjs.extend(relativeTime);
  console.log(props);
  return (
    <>
      <Card className={props.classes.card}>
        <CardMedia image={props.scream.userImage} title="User Profile Image" />
        <CardContent className={props.classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${props.scream.userHandle}`}
            color="primary"
          >
            {props.scream.userHandle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {dayjs(props.scream.createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{props.scream.body}</Typography>
        </CardContent>
      </Card>
    </>
  );
}

export default withStyles(styles)(Scream);
