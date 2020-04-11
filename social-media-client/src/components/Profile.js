import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import EditDetails from "./EditDetails";

//MUI imports
import { Button, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { LocationOn } from "@material-ui/icons";
import LinkIcon from "@material-ui/icons/Link";
import MuiLink from "@material-ui/icons/Link";
import { CalendarToday } from "@material-ui/icons";
import { Paper } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { Tooltip } from "@material-ui/core";
import { KeyboardReturn } from "@material-ui/icons";

//redux imports
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../redux/actions/UserActions";

const styles = theme => ({
  paper: {
    padding: 20
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
      "& button": {
        position: "absolute",
        top: "80%",
        left: "70%"
      }
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%"
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle"
      },
      "& a": {
        color: theme.palette.primary.main
      }
    },
    "& hr": {
      border: "none",
      margin: " 0 0 10px 0"
    },
    "& svg.button": {
      "&:hover": {
        cursor: "pointer"
      }
    }
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px"
    }
  }
});

function Profile(props) {
  console.log("props in profile", props);
  const handleImageChange = e => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    props.uploadImage(formData);
  };

  const handleEditPicture = e => {
    const fileInput = document.getElementById("image-input");
    fileInput.click();
  };

  const handleLogout = () => {
    props.logoutUser();
  };

  let profileMarkup = !props.user.loadingUser ? (
    props.user.authenticated ? (
      <Paper className={props.classes.paper}>
        <div className={props.classes.profile}>
          <div className="image-wrapper">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/socialapp-2a20a.appspot.com/o/IMG_0882.jpeg?alt=media&token=aa3c4663-acf9-4071-b812-a5042927be56"
              alt="profile image"
              className="profile-image"
            />
            <input
              type="file"
              id="image-input"
              onChange={handleImageChange}
              hidden="hidden"
            />

            <Tooltip title="Edit Profile Picture" placement="top">
              <IconButton onClick={handleEditPicture} className="button">
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink
              component={Link}
              to={`users/${props.user.credentials.handle}`}
              variant="h5"
              color="primary"
            >
              {props.user.credentials.handle}
            </MuiLink>
            <hr />
            {props.user.credentials.bio && (
              <Typography variant="body2">
                {props.user.credentials.bio}
              </Typography>
            )}
            <hr />
            {props.user.credentials.location && (
              <>
                <LocationOn color="primary" />{" "}
                <span>{props.user.credentials.location}</span>
                <hr />
              </>
            )}
            {props.user.credentials.website && (
              <>
                <LinkIcon color="primary" />
                <a
                  href={props.user.credentials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  {props.user.credentials.website}
                </a>
                <hr />
              </>
            )}
            <CalendarToday color="primary" />{" "}
            <span>
              Joined{" "}
              {dayjs(props.user.credentials.createdAt).format("MMM YYYY")}
            </span>
          </div>
          <Tooltip title="Logout" placement="top">
            <IconButton onClick={handleLogout}>
              <KeyboardReturn color="primary" />
            </IconButton>
          </Tooltip>
          <EditDetails />
        </div>
      </Paper>
    ) : (
      <Paper className={props.classes.paper}>
        <Typography variant="body2" align="center">
          No profile found, please login again
          <div className="buttons">
            <Button
              variant="conatined"
              color="primary"
              component={Link}
              to="/login"
              className={props.classes.buttons}
            >
              Login
            </Button>
            <Button
              variant="conatined"
              color="secondary"
              component={Link}
              to="/signup"
              className={props.classes.buttons}
            >
              Signup
            </Button>
          </div>
        </Typography>
      </Paper>
    )
  ) : (
    <p>loading... </p>
  );
  return profileMarkup;
}

const mapStateToProps = state => ({
  user: state.userReducer
});

export default connect(mapStateToProps, { logoutUser, uploadImage })(
  withStyles(styles)(Profile)
);
