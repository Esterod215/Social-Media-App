const functions = require("firebase-functions");

const express = require("express");
const server = express();

const cors = require("cors");
server.use(cors());

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
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
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
//gets the user details for user with specified handle
server.get("/user/:handle", getUserDetails);
server.post("/notifications", FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(server);

exports.createNotificationOnLike = functions
  .region("us-central1")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch(err => {
        console.error(err);
      });
  });
exports.deleteNotificationOnUnlike = functions.firestore
  .document("likes/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()

      .catch(err => {
        console.error(err);
      });
  });

exports.createNotificationOnComment = functions
  .region("us-central1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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

      .catch(err => {
        console.error(err);
      });
  });

exports.onUserImageChange = functions
  .region("us-central1")
  .firestore.document(`users/{userId}`)
  .onUpdate(change => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      return db
        .collection("screams")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onScreamDelete = functions
  .region("us-central1")
  .firestore.document(`/screams/{screamId}`)
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection("likes")
          .where("screamId", "==", screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => {
        console.error(err);
      });
  });
