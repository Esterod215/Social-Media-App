const functions = require("firebase-functions");

const express = require("express");
const server = express();

//scream imports
const { getAllScreams, postScream } = require("./handlers/screams");

//user imports
const { signup, login, uploadImage } = require("./handlers/users");

//middleware
const { FBAuth } = require("./util/fbAuth");

//scream routes
server.get("/screams", getAllScreams);
server.post("/screams", FBAuth, postScream);

//user routes
server.post("/signup", signup);
server.post("/login", login);
server.post("/user/image", FBAuth, uploadImage);

exports.api = functions.https.onRequest(server);
