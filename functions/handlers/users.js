const { db } = require("../util/admin");

const { firebaseConfig } = require("../util/firebaseConfig");

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

//validate user input
const { validateSignUp } = require("../util/validators");
const { validateLogin } = require("../util/validators");

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  //validate data
  const { valid, errors } = validateSignUp(newUser);
  if (!valid) {
    return res.status(400).json(errors);
  }
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
};
exports.login = (req, res) => {
  const userInfo = {
    email: req.body.email,
    password: req.body.password
  };
  const { valid, errors } = validateLogin(userInfo);

  if (!valid) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(userInfo.email, userInfo.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "wrong credentials, please try again" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};
