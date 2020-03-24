const functions = require("firebase-functions");

const express = require("express");
const server = express();

//scream imports
const {
  getAllScreams,
  postScream,
  getScream,
  deleteScream,
  commentOnScream,
  likeScream,
  unlikeScream
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
//post a scream (post)
server.post("/scream", FBAuth, postScream);
//get individual scream(post) along with comments for taht scream
server.get("/scream/:screamId", getScream);
//delete a scream (post)
server.delete("/scream/:screamId", FBAuth, deleteScream);
//post a comment on a  certain scream
server.post("/scream/:screamId/comment", FBAuth, commentOnScream);
//like a scream (post)
server.get("/scream/:screamId/like", FBAuth, likeScream);
//unlike a scream (post)
server.get("/scream/:screamId/unlike", FBAuth, unlikeScream);

//user routes
server.post("/signup", signup);
server.post("/login", login);
server.post("/user/image", FBAuth, uploadImage);
server.post("/user", FBAuth, addUserInfo);
server.get("/user", FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(server);
