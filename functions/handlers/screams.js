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
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
};
exports.postScream = (request, response) => {
  const newScream = {
    body: request.body.body,
    userHandle: request.user.handle,
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
};
