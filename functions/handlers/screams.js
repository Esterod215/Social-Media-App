const { db } = require("../util/admin");
exports.getAllScreams = (req, res) => {
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
          createdAt: doc.data().createdAt,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
};
exports.postScream = (req, res) => {
  if (req.body.body === "") {
    return res.status(400).json({ error: "cannot post empty scream" });
  }

  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
    userImage: req.user.imageUrl,
    likeCount: 0,
    commentCount: 0
  };
  db.collection("screams")
    .add(newScream)
    .then(doc => {
      resScream = newScream;
      resScream.screamId = doc.id;
      res.status(201).json(resScream);
    })
    .catch(err => {
      res.status(500).json({ error: err });
      console.error(err);
    });
};
//gets individual scream(post) along with all comments
exports.getScream = (req, res) => {
  let screamData = {};
  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        res.status(404).json({ error: "Scream not found" });
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("screamId", "==", req.params.screamId)
        .get();
    })
    .then(data => {
      screamData.comments = [];
      data.forEach(doc => {
        screamData.comments.push(doc.data());
      });
      return res.status(200).json(screamData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.message });
    });
};
//deletes a specific scream (post)
exports.deleteScream = (req, res) => {
  const screamDocument = db.doc(`screams/${req.params.screamId}`);
  screamDocument
    .get()
    .then(doc => {
      console.log(req.user);
      if (!doc.exists) {
        return res.status(404).json({ error: "scream not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return screamDocument.delete();
      }
    })
    .then(() => {
      res.json({ message: "scream deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
};
//adds comment to a specific scream (post)
exports.commentOnScream = (req, res) => {
  if (req.body.body === "") {
    return res.status(400).json({ error: "cannot send empty comment" });
  }
  const newComment = {
    body: req.body.body,
    userHandle: req.user.handle,
    screamId: req.params.screamId,
    createdAt: new Date().toISOString(),
    userImage: req.user.imageUrl
  };
  //confirm scream exists
  db.doc(`screams/${req.params.screamId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Scream does not exist" });
      }
      return doc.ref
        .update({ commentCount: doc.data().commentCount + 1 })
        .then(() => {
          return db.collection("comments").add(newComment);
        })
        .then(() => {
          res.status(201).json({ newComment });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: err.message });
        });
    });
};
exports.likeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);
  const screamDocument = db.doc(`screams/${req.params.screamId}`);
  let screamData = {};
  screamDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "scream not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            screamId: req.params.screamId,
            userHandle: req.user.handle
          })
          .then(() => {
            screamData.likeCount++;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return res.json(screamData);
          });
      } else {
        return res.status(400).json({ error: "scream already liked" });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.mesage });
    });
};
exports.unlikeScream = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("screamId", "==", req.params.screamId)
    .limit(1);
  const screamDocument = db.doc(`screams/${req.params.screamId}`);
  let screamData = {};
  screamDocument
    .get()
    .then(doc => {
      if (doc.exists) {
        screamData = doc.data();
        screamData.screamId = doc.id;
        return likeDocument.get();
      } else {
        res.status(404).json({ error: "Scream not found" });
      }
    })
    .then(data => {
      if (data.empty) {
        return res.status(400).json({ error: "scream is not liked yet" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screamData.likeCount--;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            res.json(screamData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
};
