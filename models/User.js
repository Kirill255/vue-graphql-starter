const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const md5 = require("md5");
const bcrypt = require("bcrypt");

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

UserSchema.pre("save", function (next) {
  const hash = md5(this.username);
  this.avatar = `https://gravatar.com/avatar/${hash}?d=identicon`;
  next();
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
