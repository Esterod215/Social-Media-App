const { admin } = require("./admin");
const { db } = require("./admin");

exports.FBAuth = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("could not find token");
    return res.status(403).json({ error: "not authorized" });
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      console.log("decToken", decodedToken);

      req.user = decodedToken;

      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      req.user.handle = data.docs[0].data().handle;
      return next();
    })
    .catch(err => {
      console.error(err);
      return res.status(403).json({ error: "error while verifying token" });
    });
};
