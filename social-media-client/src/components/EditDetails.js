import React, { useState, useEffect } from "react";
//Mui
import { withStyles } from "@material-ui/core/styles";
import { Tooltip } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";

//Redux
import { connect } from "react-redux";
import { editDetails } from "../redux/actions/UserActions";

const styles = theme => ({
  button: {
    float: "right"
  }
});

function EditDetails(props) {
  console.log("props in edit details", props);
  const [userDetails, setUserDetails] = useState({
    bio: "",
    website: "",
    location: "",
    open: false
  });

  useEffect(() => {
    setUserDetails({
      ...userDetails,
      bio: props.credentials.bio,
      website: props.credentials.website,
      location: props.credentials.location
    });
  }, []);

  const handleOpen = () => {
    setUserDetails({
      ...userDetails,
      open: true
    });
  };

  const handleClose = () => {
    setUserDetails({
      ...userDetails,
      open: false
    });
  };

  const handleChanges = e => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    const newDetails = {
      bio: userDetails.bio,
      website: userDetails.website,
      location: userDetails.location
    };
    props.editDetails(newDetails);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Edit details" placement="top">
        <IconButton onClick={handleOpen} className={props.classes.button}>
          <EditIcon color="primary" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={userDetails.open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Your Details</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name="bio"
              type="text"
              label="Bio"
              multiline
              rows="3"
              placeholder="A short bio about yourself"
              value={userDetails.bio}
              onChange={handleChanges}
              fullWidth
            />
            <TextField
              name="website"
              type="text"
              label="Website"
              placeholder="Personal Website"
              value={userDetails.website}
              onChange={handleChanges}
              fullWidth
            />
            <TextField
              name="location"
              type="text"
              label="Location"
              placeholder="where you live"
              value={userDetails.location}
              onChange={handleChanges}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const mapStateToProps = state => ({
  credentials: state.userReducer.credentials
});

export default connect(mapStateToProps, { editDetails })(
  withStyles(styles)(EditDetails)
);
