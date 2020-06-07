const express = require("express");
const { json, urlencoded } = require("body-parser");
const multer = require("multer");
const nodemailer = require("nodemailer");
const json2csv = require("json2csv").parse;
const fs = require("fs");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config();

const User = require("./controllers/users");
const Product = require("./controllers/products");
const { connect } = require("./helpers");
const { DB_URL } = require("./config");
const checkAuth = require("./auth/check-auth");
//const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function sendMail(toAdminEmail) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "wordtopdf000@gmail.com",
      pass: process.env.PASSWORD,
    },
  });
  var mailOptions = {
    from: `wordtopdf000@gmail.com`,
    to: `${toAdminEmail}`,
    subject: "Product created",
    attachments: [
      {
        path: `./resources/product.csv`,
      },
    ],
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(urlencoded({ extended: true }));
app.use(json());

/*
function hashPassword(psw) {
  return crypto
    .createHash("sha256")
    .update(psw, "utf8")
    .digest("base64")
    .slice(0, 24);
}
*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
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
  const productToCreate = req.body;
  try {
    const product = await Product.create(productToCreate);

    //Niz admin mailova
    const users = await User.findAll();

    //kod za slanje mail-a adminima
    for (let i = 0; i < users.length; i++) {
      if (users[i].role === 1) {
        try {
          let temp = await User.findById(productToCreate.user);
          productToCreate.user = temp.username;
          var csv = json2csv(productToCreate, {
            fields: [
              "name",
              "description",
              "price",
              "image",
              "quantity",
              "user",
            ],
          });
          fs.writeFileSync("./resources/product.csv", csv);
          console.log(csv);
          sendMail(users[i].email);
        } catch (err) {
          console.error(err);
        }
      }
    }

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
    const user = await User.findByUsername(userName);
    res.status(200).json(user);
  } catch (error) {
    res.json(error);
  }
});
app.delete("/user/:username", async (req, res) => {
  const userName = req.params.username;
  try {
    const user = await User.delete(userName);
    res.status(204).json(user);
  } catch (error) {
    res.json(error);
  }
});
function checkPassword(password) {
  //let password = req.body.password;
  let digit = false;
  let lower = false;
  let upper = false;
  if (password.length < 5 || password.length > 25) {
    return false;
  }
  for (let i = 0; i < password.length; i++) {
    if (password[i] >= "a" && password[i] <= "z") {
      lower = true;
    } else if (password[i] >= "A" && password[i] <= "Z") {
      upper = true;
    } else if (password[i] >= "0" && password[i] <= "9") {
      digit = true;
    }
  }
  return digit && upper && lower;
}

app.put("/user/:username", (req, res) => {
  const userName = req.params.username;
  if (req.body.password !== undefined && !checkPassword(req.body.password)) {
    throw "Invalid Password";
  }
  const queryToUpdate = req.body;
  console.log("pass", req.body.password);
  try {
    function updateFields() {
      return User.update(userName, queryToUpdate)
        .then((user) => {
          console.log("User successfuly updated");
          res.status(204).json(user);
        })
        .catch((e) => {
          console.log(error);
          res.json(error);
        });
    }
    if (req.body.password === undefined) {
      updateFields();
      return;
    }
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        req.body.password = hash;
        console.log("pass nakon hash", req.body.password);
        updateFields();
      }
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.post("/user", (req, res) => {
  try {
    if (!checkPassword(req.body.password)) {
      throw "Invalid Password";
    }
    console.log("pass prije hassh", req.body.password);
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        req.body.password = hash;
        console.log("pass nakon hash", req.body.password);
        const userToCreate = req.body;
        User.create(userToCreate)
          .then((user) => {
            console.log("User successfuly created");
            res.status(201).json(user);
          })
          .catch((e) => {
            console.log(error);
            res.json(error);
          });
      }
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.post("/user/login", (req, res) => {
  try {
    User.findByUsername(req.body.username)
      .then((user) => {
        let { email } = user[0];
        console.log("user: ", user);
        if (email.length < 1 || req.body.email !== email) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          console.log("req pass:", req.body.password);
          console.log("user pass from db: ", user[0].password);
          if (err) {
            return res.status(401).json({
              message: "Auth failed",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                username: user[0].username,
                email: user[0].email,
              },
              process.env.JWT_KEY,
              { expiresIn: "1h" }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token,
            });
          }
          return res.status(401).json({
            message: "Auth failed",
          });
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
  } catch (error) {
    console.log("error", error);
    res.json(error);
  }
  /*.then((user) => {
    //we don't have a user
    if (user.length < 1) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
  });*/

  /*
      //check if the password sent in req matches the password in the db
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          //passwords match, password entered is correct one
          return res.status(200).json({
            message: "Auth successful",
          });
        }
        return res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });*/
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

//7. user queries
app.put("/user", async (req, res) => {
  const { username, id } = req.query;
  console.log("username", username);
  console.log("id", id);
  try {
    let productID = await Product.findProductId(id); //id je name u tabeli Product
    console.log("productID", productID);
    const user = await User.findProductAndUpdate(username, productID);
    console.log(user);
    res.status(204).json(user);
  } catch (error) {
    console.log("error", error);
    res.json(error);
  }
});

app.get("/user", async (req, res) => {
  const { username } = req.query;
  console.log("username", username);
  try {
    const user = await User.findByUsername(username);
    let productID = user[0].product;
    console.log("niz id-ijeva za usera:", productID);
    res.status(200).json(user);
  } catch (error) {
    console.log("error", error);
    res.json(error);
  }
});

app.delete("/user", async (req, res) => {
  const { username, id } = req.query;
  console.log("username", username);
  console.log("id", id);
  try {
    const product = await Product.findProductId(id); //id je name u tabeli Product
    let productID = product[0];
    console.log("productID", productID);

    const user = await User.deleteProductField(username, productID);
    console.log(user);
    res.status(204).json(user);
  } catch (error) {
    console.log("error", error);
    res.json(error);
  }
});

app.get("/profit", async (req, res) => {
  try {
    var users = await Product.profit();
    for (let i = 0; i < users.length; i++) {
      const temp = await User.findById(users[i]);
      users[i]._id = temp.username;
    }
    res.status(200).json(users);
  } catch (error) {
    console.log("error", error);
    res.json(error);
  }
});

//updating product field in user table
app.patch("/user", async (req, res) => {
  const { username, id } = req.query;
  console.log("username", username);
  console.log("id", id);

  try {
    const user = await User.findByUsername(username);
    console.log("user", user); //nama treba user.product
    let productID = await Product.findProductId(id);
    console.log("productID", productID);
    const productField = await User.update(username, {
      $set: { product: productID },
    });
    res.status(204).json(user);
  } catch (error) {
    console.log("error", error);
    res.json(error);
  }
});

// Odraditi i grupisanje (može odvojena funkcija van APIa) tako da ta funkcija
// vraća za svakog korisnika moguću zaradu od proizvoda koji su dodati od
// strane konkretnog korisnika

connect(DB_URL)
  .then(() =>
    app.listen(5000, () => {
      console.log("server on http://localhost:5000");
    })
  )
  .catch((e) => console.error(e));
