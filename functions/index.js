const functions = require("firebase-functions");

const express = require("express");
const server = express();

const { db } = require("./util/admin");

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

exports.createNotificationOnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    db.doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id
          });
        }
      })

      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        console.log("error");
        return;
      });
  });
exports.deleteNotificationOnUnlike = functions.firestore
  .document("likes/{id}")
  .onDelete(snapshot => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region("us-central1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    db.doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            sender: snapshot.data().userHandle,
            recipient: doc.data().userHandle,
            screamId: doc.id,
            type: "comment",
            read: false
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });
