const functions = require("firebase-functions");

const express = require("express");
const server = express();

//scream routes
const { getAllScreams } = require("./handlers/screams");
const { postScream } = require("./handlers/screams");

//register/login routes
const { signup } = require("./handlers/users");
const { login } = require("./handlers/users");

//middleware
const { FBAuth } = require("./util/fbAuth");
//get screams
server.get("/screams", getAllScreams);
//create scream
server.post("/screams", FBAuth, postScream);

//helper function to validate empty strings

//signup route
server.post("/signup", signup);

//login route
server.post("/login", login);

exports.api = functions.https.onRequest(server);
