const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: Number,
  price: mongoose.Decimal128,
  category: String,
  sold: Boolean,
  dateOfSale: String || Number,
});

const Product = mongoose.model("products", ProductSchema);
module.exports = Product;
