const Product = require("./modals/Product");
const mongoose = require("mongoose");
const axios = require("axios");

async function getProducts() {
  const dataExist = await Product.find({});
  if (dataExist.length) {
    return console.log("data is exist");
  }
  const products = await axios.get(
    "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
  );

  for (let i = 0; i < products.data.length; i++) {
    const product = new Product({
      id: products.data[i]["id"],
      price: products.data[i]["price"],
      category: products.data[i]["category"],
      sold: products.data[i]["sold"],
      dateOfSale: new Date(products.data[i]["dateOfSale"]).getMonth() + 1,
    });
    product.save();
  }
}

module.exports = { getProducts };
