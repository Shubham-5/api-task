const express = require("express");
require("dotenv").config();
const axios = require("axios");
const { dbConnection } = require("./dbConnection");
const { getProducts } = require("./insertDB");
const Product = require("./modals/Product");
const app = express();
const PORT = process.env.PORT || 500;
const ADDRESS = process.env.ADDRESS || "http://localhost:";

dbConnection();
getProducts();

async function getSelectedProducts(filter) {
  let selectedData = await Product.find({ dateOfSale: filter });
  return selectedData;
}

app.get("/api/stats", async (req, res) => {
  const month = req.query.month;
  try {
    const selectedData = await getSelectedProducts(month);

    let saleAmount = 0,
      soldItems = 0,
      notSoldItems = 0;

    selectedData.map((item) => {
      saleAmount = saleAmount + parseFloat(item.price);
      item.sold ? soldItems++ : notSoldItems++;
    });

    res.status(200).json({ saleAmount, soldItems, notSoldItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/bar", async (req, res) => {
  try {
    const month = req.query.month;

    const selectedData = await getSelectedProducts(month);

    const items = [
      { price: { from: 0, to: 100 }, items: null },
      { price: { from: 101, to: 200 }, items: null },
      { price: { from: 201, to: 300 }, items: null },
      { price: { from: 301, to: 400 }, items: null },
      { price: { from: 401, to: 500 }, items: null },
      { price: { from: 501, to: 600 }, items: null },
      { price: { from: 601, to: 700 }, items: null },
      { price: { from: 701, to: 800 }, items: null },
      { price: { from: 801, to: 900 }, items: null },
      { price: { from: 901, to: 1000 }, items: null },
    ].map((item) => {
      item.items = selectedData.filter(
        (x) =>
          parseInt(x.price) <= item.price?.to &&
          parseInt(x.price) > item.price?.from
      ).length;
      return item;
    });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/pie", async (req, res) => {
  try {
    const month = req.query.month;
    let categories = {};
    const selectedData = await getSelectedProducts(month);
    selectedData.map((item) => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/all", async (req, res) => {
  try {
    let pieData = await axios.get(`${ADDRESS}${PORT}/api/pie/?month=10`);
    let barData = await axios.get(`${ADDRESS}${PORT}/api/bar/?month=10`);
    let statsData = await axios.get(`${ADDRESS}${PORT}/api/stats/?month=10`);
    res.status(200).json({
      statistics: statsData.data,
      barChart: barData.data,
      pieChart: pieData.data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log("listening");
});
