const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./ServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialapp-2a20a.firebaseio.com"
});

const express = require("express");
const server = express();

exports.getScreams = functions.https.onRequest((request, response) => {
  if (request.method != "POST") {
    return response.status(400).json({ error: "Method not allowed" });
  }
  admin
    .firestore()
    .collection("screams")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push(doc.data());
      });
      return response.json(screams);
    })
    .catch(err => console.error(err));
});

exports.createScream = functions.https.onRequest((request, response) => {
  const newScream = {
    body: request.body.body,
    userHandle: request.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };
  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then(doc => {
      response
        .status(201)
        .json({ message: `document ${doc.id} created successfuly` });
    })
    .catch(err => {
      response.status(500).json({ error: err });
      console.error(err);
    });
});
