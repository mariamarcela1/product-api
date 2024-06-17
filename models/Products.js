const mongoose = require("mongoose");

const Produto = mongoose.model("Produto", {
  name: String,
  description: String,
  color: String,
  weight: Number,
  type: String,
  price: Number,
  dateAdded: Date,
});

module.exports = Produto;
