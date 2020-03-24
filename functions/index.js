const functions = require("firebase-functions");

const express = require("express");
const server = express();

//scream imports
const { getAllScreams, postScream } = require("./handlers/screams");

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
server.post("/user/image", FBAuth, uploadImage);
server.post("/user", FBAuth, addUserInfo);
server.get("/user", FBAuth, getAuthenticatedUser);

//user routes
server.post("/signup", signup);
server.post("/login", login);

exports.api = functions.https.onRequest(server);
