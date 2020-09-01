"use strict";
const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI =
  "mongodb+srv://wtf:DtnGOXLlEy2GxLwO@cluster0.1bw4q.mongodb.net";
let cachedDb = null;

function connectToDatabase(uri) {
  if (cachedDb) {
    return Promise.resolve(cachedDb);
  }

  return MongoClient.connect(uri).then((db) => {
    cachedDb = db.db("ourrecipes");
    return cachedDb;
  });
}

function addUser(db, e) {
  return db
    .collection("user")
    .insertOne({
      id: e.userName,
      name: e.request.userAttributes.name,
      email: e.request.userAttributes.email,
      photo: "",
      bio: "",
      creationDate: "",
      groups: [],
      bookmarks: [],
      shoppinglist: [],
      followers: [],
      following: [],
      reviews: [],
      recipes: [],
      pictures: [],
    })
    .then(() => {
      return { statusCode: 200, body: "success" };
    })
    .catch(() => {
      return { statusCode: 500, body: "error" };
    });
}

module.exports.createUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase(MONGODB_URI)
    .then((db) => addUser(db, event))
    .then(() => {
      context.done(null, event);
    })
    .catch((err) => {
      callback(err);
    });
};
