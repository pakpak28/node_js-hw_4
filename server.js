const express = require("express");
const mongoose = require("mongoose");
const app = express();

const PORT = process.env.PORT || 8080;
const users = [];

const myLogger = function (req, res, next) {
  console.log("New request has been detected.");
  next();
};
const readHeader = function (req, res, next) {
  if (req.headers.iknowyoursecret == "TheOwlsAreNotWhatTheySeem") {
    const { username } = req.headers;
    const { remoteAddress } = req.connection;
    console.log(
      `Glad to see >>> ${username} 
      and his ip adress >>> ${remoteAddress}.`
    );
    next();
  } else {
    console.log("u forgot to pass right secret header");
    res.end("bye!");
  }
};

mongoose.connect("mongodb://localhost:27017");
const UserSchema = mongoose.Schema({ name: String, ip: String });
const User = mongoose.model("Users", UserSchema);

const writeDb = function (req, res, next) {
  const { username } = req.headers;
  const { remoteAddress } = req.connection;
  const user = new User({ name: username, ip: remoteAddress });
  user.save((error, savedUser) => {
    if (error) {
      throw error;
    }
    console.log(
      `greetings ${savedUser.name} ,  ur ip adress was determined at ${savedUser.ip} `
    );
    next();
  });
};

app.use(myLogger, readHeader, writeDb);

app.get("/", function (req, res) {
  res.send("assertion to db completed...");
});
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}...`);
  User.find({}, (err, users) => {
    console.log("users at moment >>>>", users.map((u) => u.name).join(" "));
  });
});
