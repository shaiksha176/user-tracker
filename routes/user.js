const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/profile", async (req, res) => {
  //console.log(req.session.userId);
  const user = await User.findById(req.session.userId);
  try {
    //console.log(user);
    res.render("profile", {
      name: user.name,
      password: user.password,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/signup", async (req, res) => {
  // console.log(req.body);
  const { name, password, color } = req.body;
  try {
    const user = new User({
      name,
      password,
      color,
    });
    const response = await user.save();
    // console.log("user successfully saved to db");
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.post("/", async (req, res) => {
  const { name, password } = req.body;
  //console.log(req.body);
  const finduser = await User.findOne({ name, password });
  try {
    if (finduser) {
      // console.log(finduser);
      req.session.userId = finduser._id;
      finduser.programming.push("css");
      finduser.login_data.push({ date: new Date().toLocaleString() });
      finduser.save();
      res.redirect("/profile");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    // console.log(error);
    res.redirect("/");
  }
});

router.get("/logout", (req, res) => {
  req.session.destory;
  res.redirect("/");
});

router.get("/logintracker", async (req, res) => {
  const login_response = await User.findById(
    req.session.userId,
    "login_data -_id"
  );
  try {
    //console.log(typeof login_data);
    const { login_data } = login_response;

    res.render("login_tracker", { data: login_data, name: "sheldon" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/uploads", async (req, res) => {
  const user = await User.findById(req.session.userId, "images -_id");
  try {
    const { images } = user;
    // console.log(images);
    res.render("upload", { images });
  } catch (error) {
    console.log(error);
  }
});

router.post("/upload/photo", upload.single("image"), async (req, res) => {
  console.log("uploading");
  //console.log(req.file);
  const user = await User.findById(req.session.userId);
  try {
    //console.log(user);
    user.images.push({ img: req.file.filename });
    user.save();
    res.redirect("/uploads");
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error");
  }
});
router.post("/update", async (req, res) => {
  //console.log(req.body);
  const update = await User.findByIdAndUpdate(req.session.userId, {
    name: req.body.name,
    password: req.body.password,
  });
  try {
    res.send("user data successfully updated");
  } catch (error) {
    console.log(error);
    res.send("cannot updated data");
  }
  res.send("thank you for sending");
});
let nickname = null;

router.get("/forgotpassword", (req, res) => {
  res.render("forgot_password");
});
router.get("/reset/:id", (req, res) => {
  res.render("reset_password");
});
router.post("/reset", (req, res) => {
  const { password, confirmpassword } = req.body;
  User.findOneAndUpdate({ name: nickname }, { password: password }).then(
    (data) => {
      //console.log("successfully updated");
      nickname = null;
      res.redirect("/");
    }
  );
});

router.post("/forgot", async (req, res) => {
  const { name, color } = req.body;
  const findcolor = await User.findOne({ name: name }, "color -_id");
  if (findcolor.color == color) {
    //console.log("you are superman");
    const id = uuidv4();
    nickname = name;
    res.redirect("/reset/" + id);
  } else {
    req.flash("info", "Access denied");
  }
  res.redirect("/forgotpassword");
});
router.post("/reset", (req, res) => {
  const { email, password } = req.body;
});

module.exports = router;
