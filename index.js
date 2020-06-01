const express = require("express");
const { json, urlencoded } = require("body-parser");
const multer = require("multer");

const User = require("./controllers/users");
const Product = require("./controllers/products");
const { connect } = require("./helpers");
const { DB_URL } = require("./config");

const app = express();
//we are saying parse only requests at /uploads route
app.use("/uploads", express.static("uploads")); //makes folder publicaly accessible
app.use(urlencoded({ extended: true }));
app.use(json());

//how file gets stored
const storage = multer.diskStorage({
  //whrete to store file
  destination: function (req, file, cb) {
    cb(null, "./uploads"); //1.argument is potential error, 2.arg - path where we want to store file
  },
  //how to name file
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); //this stores the file
  } else {
    //reject a file
    cb(null, false); //this ignores files and does not store it
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1204 * 3,
  },
  fileFilter: fileFilter,
});

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
app.post("/product", upload.single("image"), async (req, res) => {
  console.log(req.file);
  //const productToCreate = req.body;
  const productToCreate = {
    _id: req.body._id,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.file.path,
    quantity: req.body.quantity,
    user: req.body.user,
  };
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
