const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  name: String,
  artist: String,
  duration: Number,
});

const Song = mongoose.model("Song", songSchema);
