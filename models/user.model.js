const mongoose = require("mongoose");
const schema = mongoose.Schema;

const user_schema = new schema(
  {
    name: {
      type: String,
    },

    password: {
      type: String,
    },

    profile: {
      type: String,
    },
    color: {
      type: String,
    },
    programming: [String],
    login_data: [{ date: String }],
    images: [
      {
        img: String,
      },
    ],
  },
  { timestamps: true }
);
const User = mongoose.model("User", user_schema);

// const user = new User({
//   name: "spiderman",
//   password: "123456",
//   login_data: {
//     date: new Date().toLocaleString(),
//   },
// });
module.exports = User;
