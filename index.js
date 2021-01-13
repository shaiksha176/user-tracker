const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const port = process.env.PORT || 8080;
const flash = require("express-flash");
const user_router = require("./routes/user");
const MongoStore = require("connect-mongo")(session);
require("dotenv").config();
const uri =
  "mongodb+srv://<username>:<password>@cluster0.0kurt.mongodb.net/<dbname>?retryWrites=true&w=majority";

mongoose
  .connect(process.env.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      url: process.env.uri,
      ttl: 60 * 60,
    }),
  })
);
app.use(flash());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", user_router);

app.listen(port, () => console.log("server is up and running on port " + port));
