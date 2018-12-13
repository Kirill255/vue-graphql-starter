const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: "Please supply a name",
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: "Please Supply an email address",
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: "Please supply a password",
    trim: true
  },
  avatar: {
    type: String
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  favorites: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "Post"
  }
});

module.exports = mongoose.model("User", UserSchema);
