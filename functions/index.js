const functions = require("firebase-functions");

const express = require("express");
const server = express();

//scream imports
const {
  getAllScreams,
  postScream,
  getScream,
  commentOnScream
} = require("./handlers/screams");

//user imports
const {
  signup,
  login,
  uploadImage,
  addUserInfo,
  getAuthenticatedUser
} = require("./handlers/users");

//middleware
const { FBAuth } = require("./util/fbAuth");

//scream routes
server.get("/screams", getAllScreams);
server.post("/screams", FBAuth, postScream);
//get individual scream(post) along with comments for taht scream
server.get("/screams/:screamId", getScream);
//post a comment on a  certain scream
server.post("/screams/:screamId/comment", FBAuth, commentOnScream);

//user routes
server.post("/signup", signup);
server.post("/login", login);
server.post("/user/image", FBAuth, uploadImage);
server.post("/user", FBAuth, addUserInfo);
server.get("/user", FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(server);
