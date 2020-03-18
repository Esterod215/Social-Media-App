const functions = require("firebase-functions");

const admin = require("firebase-admin");

const serviceAccount = require("./ServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialapp-2a20a.firebaseio.com"
});

const express = require("express");
const server = express();

const firebaseConfig = {
  apiKey: "AIzaSyAszNSwxjhaIWuN-q6l02Q_g045qUUTOb0",
  authDomain: "socialapp-2a20a.firebaseapp.com",
  databaseURL: "https://socialapp-2a20a.firebaseio.com",
  projectId: "socialapp-2a20a",
  storageBucket: "socialapp-2a20a.appspot.com",
  messagingSenderId: "542916886559",
  appId: "1:542916886559:web:d10eb163b20189d08c552a",
  measurementId: "G-8HMMLE9E9S"
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

server.get("/screams", (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
});
server.post("/screams", (request, response) => {
  const newScream = {
    body: request.body.body,
    userHandle: request.body.userHandle,
    createdAt: new Date().toISOString()
  };
  db.collection("screams")
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

//helper function to validate empty strings
const isEmpty = string => {
  if (string.trim() === "") {
    return true;
  } else {
    return false;
  }
};
const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true;
  } else {
    return false;
  }
};

//signup route
server.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  let errors = {};
  if (isEmpty(newUser.email)) {
    errors.email = "must not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "must be a valid email address";
  }
  if (isEmpty(newUser.password)) {
    errors.password = "Must not be empty";
  }
  if (newUser.password !== newUser.confirmPassword) {
    errors.confirmPassword = "passwords must match";
  }
  if (isEmpty(newUser.handle)) {
    errors.handle = "Must not be empty";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }
  //validate data
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        res.status(400).json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        userId,
        email: newUser.email,
        handle: newUser.handle,
        createdAt: new Date().toISOString()
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "email already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

exports.api = functions.https.onRequest(server);
