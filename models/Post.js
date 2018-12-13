const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: "Please supply a title",
    trim: true
  },
  imageUrl: {
    type: String,
    required: "Please Supply an imageUrl",
    trim: true
  },
  categories: {
    type: [String],
    required: "Please supply a categories"
  },
  description: {
    type: String,
    required: "Please supply a description"
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  messages: [{
    messageBody: {
      type: String,
      required: "Please supply a messageBody"
    },
    messageDate: {
      type: Date,
      default: Date.now
    },
    messageUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    }
  }]
});

module.exports = mongoose.model("Post", PostSchema);
