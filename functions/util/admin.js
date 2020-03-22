const ServiceAccountKey = require("../ServiceAccountKey");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(ServiceAccountKey),
  databaseURL: "https://socialapp-2a20a.firebaseio.com",
  storageBucket: "socialapp-2a20a.appspot.com"
});
const db = admin.firestore();

module.exports = { admin, db };
