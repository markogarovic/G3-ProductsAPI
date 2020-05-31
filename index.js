const express = require("express");
const { json, urlencoded } = require("body-parser");

const User = require("./controllers/users");
const Product = require("./controllers/products");
const { connect } = require("./helpers");
const { DB_URL } = require("./config");

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

app.get("/product/:name", async (req, res) => {
  const productName = req.params.name;
  try {
    const product = await Product.findByName(productName);
    res.status(200).json(product);
  } catch (error) {
    res.json(error);
  }
});
app.delete("/product/:name", async (req, res) => {
  const productName = req.params.name;
  try {
    const product = await Product.delete({ name: productName });
    res.status(204).json(product);
  } catch (error) {
    res.json(error);
  }
});
app.put("/product/:name", async (req, res) => {
  const productName = req.params.name;

  const queryToUpdate = req.body;
  try {
    const product = await Product.update({ name: productName }, queryToUpdate);
    res.status(204).json(product);
  } catch (error) {
    res.json(error);
  }
});
app.post("/product", async (req, res) => {
  const productToCreate = req.body;
  try {
    const product = await Product.create(productToCreate);
    res.status(201).json(product);
  } catch (error) {
    res.json(error);
  }
});
app.get("/products", async (req, res) => {
  try {
    if (Object.keys(req.query).length === 0) {
      const products = await Product.findAll();
      res.status(200).json(products);
    } else {
      const limit = parseInt(req.query.limit);
      const offset = parseInt(req.query.offset);

      const product = await Product.findGroupOfProducts(limit, offset);
      res.status(200).json(product);
    }
  } catch (error) {
    res.json(error);
  }
});

app.get("/user/:username", async (req, res) => {
  const userName = req.params.username;
  try {
    const user = await User.findByName(userName);
    res.status(200).json(user);
  } catch (error) {
    res.json(error);
  }
});
app.delete("/user/:username", async (req, res) => {
  const userName = req.params.username;
  try {
    const user = await User.delete({ username: userName });
    res.status(204).json(user);
  } catch (error) {
    res.json(error);
  }
});
app.put("/user/:username", async (req, res) => {
  const userName = req.params.username;

  const queryToUpdate = req.body;
  try {
    const user = await User.update({ name: userName }, queryToUpdate);
    res.status(204).json(user);
  } catch (error) {
    res.json(error);
  }
});
app.post("/user", async (req, res) => {
  const userToCreate = req.body;
  try {
    const user = await User.create(userToCreate);
    res.status(201).json(user);
  } catch (error) {
    res.json(error);
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.json(error);
  }
});

app.get("/product_id/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    res.status(200).json(product);
  } catch (error) {
    res.json(error);
  }
});
app.delete("/product_id/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.deleteById(productId);
    res.status(204).json(product);
  } catch (error) {
    res.json(error);
  }
});
app.put("/product_id/:id", async (req, res) => {
  const productId = req.params.id;

  const queryToUpdate = req.body;
  try {
    const product = await Product.updateById(productId, queryToUpdate);
    res.status(204).json(product);
  } catch (error) {
    res.json(error);
  }
});
app.put("/product_dec/:id", async (req, res) => {
  const productId = req.params.id;
  console.log(productId);
  try {
    const product = await Product.dec(productId);
    res.status(204).json(product);
  } catch (error) {
    res.json(error);
  }
});
app.put("/product_inc/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.inc(productId);
    res.status(204).json(product);
  } catch (error) {
    res.json(error);
  }
});
app.get("/product_num/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.numberOfProducts(productId);
    res.status(200).json(product);
  } catch (error) {
    res.json(error);
  }
});

connect(DB_URL)
  .then(() =>
    app.listen(5000, () => {
      console.log("server on http://localhost:5000");
    })
  )
  .catch((e) => console.error(e));
